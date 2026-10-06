import * as THREE from 'three'

// Shared uniforms so a single frame callback can drive every animated shader.
export const sharedUniforms = {
  uTime: { value: 0 },
}

export const armorMat = new THREE.MeshStandardMaterial({ color: '#e8ecf1', roughness: 0.42, metalness: 0.08 })
export const undersuitMat = new THREE.MeshStandardMaterial({ color: '#16191f', roughness: 0.85, metalness: 0.05 })
export const visorMat = new THREE.MeshStandardMaterial({ color: '#07090d', roughness: 0.15, metalness: 0.6 })
export const gunMat = new THREE.MeshStandardMaterial({ color: '#1d2027', roughness: 0.5, metalness: 0.7 })
export const droidMat = new THREE.MeshStandardMaterial({ color: '#c7b48c', roughness: 0.6, metalness: 0.25 })
export const droidDarkMat = new THREE.MeshStandardMaterial({ color: '#6e5f45', roughness: 0.7, metalness: 0.2 })
export const hullMat = new THREE.MeshStandardMaterial({ color: '#9aa2ae', roughness: 0.55, metalness: 0.55 })
export const hullDarkMat = new THREE.MeshStandardMaterial({ color: '#4a515c', roughness: 0.6, metalness: 0.5 })
export const republicRedMat = new THREE.MeshStandardMaterial({ color: '#a8232c', roughness: 0.5, metalness: 0.3 })
export const padMat = new THREE.MeshStandardMaterial({ color: '#1a1f29', roughness: 0.35, metalness: 0.8 })

const colorCache = new Map<string, THREE.MeshStandardMaterial>()
export function battalionMat(color: string) {
  let m = colorCache.get(color)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.1 })
    colorCache.set(color, m)
  }
  return m
}

const glowCache = new Map<string, THREE.MeshBasicMaterial>()
export function glowMat(color: string, opacity = 1) {
  const key = `${color}-${opacity}`
  let m = glowCache.get(key)
  if (!m) {
    m = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    })
    glowCache.set(key, m)
  }
  return m
}

export const NOISE_GLSL = /* glsl */ `
float hash(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),
                 mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                 mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p){ float v=0.0; float a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5; } return v; }
`

// Holographic projection: fresnel edge glow, scanlines, flicker.
export function createHologramMaterial(color = '#5cc8ff') {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: sharedUniforms.uTime, uColor: { value: new THREE.Color(color) } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vView; varying vec3 vWorld;
      void main(){
        vec4 wp = modelMatrix * vec4(position,1.0);
        vWorld = wp.xyz;
        vN = normalize(normalMatrix * normal);
        vec4 mv = viewMatrix * wp;
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uColor;
      varying vec3 vN; varying vec3 vView; varying vec3 vWorld;
      void main(){
        float fres = pow(1.0 - abs(dot(normalize(vN), vView)), 2.0);
        float scan = 0.55 + 0.45 * sin(vWorld.y * 90.0 - uTime * 6.0);
        float band = smoothstep(0.0, 0.08, fract(vWorld.y * 0.6 - uTime * 0.35)) ;
        float flicker = 0.85 + 0.15 * sin(uTime * 37.0) * sin(uTime * 11.0);
        float a = (0.12 + fres * 0.9) * scan * flicker * (0.6 + 0.4 * band);
        gl_FragColor = vec4(uColor * (0.6 + fres), a);
      }`,
  })
}

export function createPlanetMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: sharedUniforms.uTime,
      uC1: { value: new THREE.Color('#1a2a5a') },
      uC2: { value: new THREE.Color('#6a8aff') },
      uC3: { value: new THREE.Color('#d8e4ff') },
      uLight: { value: new THREE.Vector3(-0.6, 0.35, 0.7).normalize() },
      uSeed: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vObj; varying vec3 vN;
      void main(){
        vObj = position;
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform vec3 uLight; uniform float uSeed;
      varying vec3 vObj; varying vec3 vN;
      ${NOISE_GLSL}
      void main(){
        vec3 p = normalize(vObj);
        float n = fbm(p * 2.6 + vec3(uSeed, 0.0, uTime * 0.004));
        float bands = fbm(vec3(p.y * 6.0 + n * 1.6, uSeed, 0.0));
        float h = mix(n, bands, 0.35);
        vec3 col = mix(uC1, uC2, smoothstep(0.35, 0.6, h));
        col = mix(col, uC3, smoothstep(0.62, 0.8, h));
        float clouds = smoothstep(0.55, 0.85, fbm(p * 5.0 + vec3(uTime * 0.01, uSeed * 2.0, 0.0)));
        col = mix(col, vec3(0.95), clouds * 0.35);
        float d = dot(normalize(vN), normalize(uLight));
        float light = smoothstep(-0.15, 0.6, d);
        vec3 lit = col * (0.04 + light * 1.1);
        // city lights / glints on the night side
        float city = step(0.78, fbm(p * 24.0 + uSeed)) * (1.0 - smoothstep(-0.2, 0.05, d));
        lit += uC3 * city * 0.6;
        gl_FragColor = vec4(lit, 1.0);
      }`,
  })
}

export function createAtmosphereMaterial(color = '#7fb4ff') {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uLight: { value: new THREE.Vector3(-0.6, 0.35, 0.7).normalize() },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vView;
      void main(){
        vN = normalize(mat3(modelMatrix) * normal);
        vec4 wp = modelMatrix * vec4(position,1.0);
        vView = normalize(cameraPosition - wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform vec3 uLight;
      varying vec3 vN; varying vec3 vView;
      void main(){
        float rim = pow(1.0 - abs(dot(vN, vView)), 1.0);
        float i = smoothstep(0.0, 1.0, rim) * pow(rim, 2.5) * 2.2;
        float lit = smoothstep(-0.4, 0.6, dot(-vN, uLight)) * 0.85 + 0.15;
        gl_FragColor = vec4(uColor * i * lit, i * lit);
      }`,
  })
}

export function createNebulaMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: sharedUniforms.uTime },
    side: THREE.BackSide,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; varying vec3 vDir;
      ${NOISE_GLSL}
      void main(){
        vec3 d = normalize(vDir);
        float n = fbm(d * 3.0 + vec3(0.0, 0.0, uTime * 0.002));
        float m = fbm(d * 6.0 + n * 2.0);
        vec3 deep = vec3(0.004, 0.008, 0.02);
        vec3 blue = vec3(0.05, 0.14, 0.32) * smoothstep(0.45, 0.85, m) * smoothstep(0.1, 0.9, d.x * 0.5 + 0.6);
        vec3 red = vec3(0.28, 0.04, 0.05) * smoothstep(0.55, 0.9, n) * smoothstep(0.2, 1.0, -d.x * 0.6 + 0.3);
        float band = exp(-pow(d.y * 3.2 + d.x * 0.6, 2.0)) * 0.08;
        gl_FragColor = vec4(deep + blue * 0.55 + red * 0.45 + vec3(0.12, 0.16, 0.24) * band * m, 1.0);
      }`,
  })
}
