import * as THREE from 'three'

// Shared uniforms so a single frame callback can drive every animated shader.
export const sharedUniforms = {
  uTime: { value: 0 },
}

// Sun direction, shared by the planet shaders and the scene lights so shading agrees.
export const SUN_DIR = new THREE.Vector3(-0.42, 0.46, -0.78).normalize()

export const hullMat = new THREE.MeshStandardMaterial({ color: '#6d7681', roughness: 0.62, metalness: 0.55 })
export const hullDarkMat = new THREE.MeshStandardMaterial({ color: '#2b313a', roughness: 0.7, metalness: 0.5 })
export const hullPanelMat = new THREE.MeshStandardMaterial({ color: '#4a525c', roughness: 0.75, metalness: 0.45 })
export const republicRedMat = new THREE.MeshStandardMaterial({ color: '#7a1d24', roughness: 0.6, metalness: 0.3 })
export const sepHullMat = new THREE.MeshStandardMaterial({ color: '#4a3c33', roughness: 0.75, metalness: 0.35 })
export const sepHullDarkMat = new THREE.MeshStandardMaterial({ color: '#2a221d', roughness: 0.8, metalness: 0.3 })

const glowCache = new Map<string, THREE.MeshBasicMaterial>()
export function glowMat(color: string, opacity = 1) {
  const key = `${color}-${opacity}`
  let m = glowCache.get(key)
  if (!m) {
    m = new THREE.MeshBasicMaterial({
      color,
      transparent: opacity < 1,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      fog: false,
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
float fbm(vec3 p){ float v=0.0; float a=0.5; for(int i=0;i<6;i++){ v+=a*noise(p); p=p*2.02+vec3(1.7,9.2,3.1); a*=0.5; } return v; }
float ridged(vec3 p){ float v=0.0; float a=0.5; for(int i=0;i<5;i++){ v+=a*(1.0-abs(2.0*noise(p)-1.0)); p=p*2.1; a*=0.5; } return v; }
`

/** Planet surface: oceans with specular, continents, polar caps, soft terminator, night-side city lights. */
export function createPlanetMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: sharedUniforms.uTime,
      uOcean: { value: new THREE.Color('#0b1c3a') },
      uLand: { value: new THREE.Color('#3d4a3a') },
      uHigh: { value: new THREE.Color('#b9b6a6') },
      uLights: { value: new THREE.Color('#ffc98a') },
      uLight: { value: SUN_DIR.clone() },
      uSeed: { value: 1 },
      uOceanLevel: { value: 0.5 },
      uIce: { value: 0.75 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vObj; varying vec3 vN; varying vec3 vWorld;
      void main(){
        vObj = position;
        vN = normalize(mat3(modelMatrix) * normal);
        vec4 wp = modelMatrix * vec4(position,1.0);
        vWorld = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uOcean; uniform vec3 uLand; uniform vec3 uHigh; uniform vec3 uLights;
      uniform vec3 uLight; uniform float uSeed; uniform float uOceanLevel; uniform float uIce;
      varying vec3 vObj; varying vec3 vN; varying vec3 vWorld;
      ${NOISE_GLSL}
      void main(){
        vec3 p = normalize(vObj);
        vec3 q = p * 2.4 + vec3(uSeed * 7.3, uSeed * 1.9, 0.0);
        float continents = fbm(q);
        float detail = ridged(q * 3.0 + continents);
        float h = continents * 0.75 + detail * 0.25;
        float land = smoothstep(uOceanLevel - 0.02, uOceanLevel + 0.02, h);
        float shallow = smoothstep(uOceanLevel - 0.09, uOceanLevel, h);
        vec3 ocean = mix(uOcean * 0.7, uOcean * 1.35, shallow);
        float elev = smoothstep(uOceanLevel, uOceanLevel + 0.22, h);
        vec3 landCol = mix(uLand, uHigh, pow(elev, 1.6));
        landCol *= 0.85 + 0.3 * noise(q * 18.0);
        float ice = smoothstep(uIce, uIce + 0.08, abs(p.y) + noise(q * 6.0) * 0.08);
        vec3 albedo = mix(ocean, landCol, land);
        albedo = mix(albedo, vec3(0.9, 0.93, 0.97), ice);

        vec3 N = normalize(vN);
        vec3 L = normalize(uLight);
        float ndl = dot(N, L);
        float day = smoothstep(-0.08, 0.25, ndl);
        vec3 V = normalize(cameraPosition - vWorld);
        vec3 H = normalize(L + V);
        float spec = pow(max(dot(N, H), 0.0), 90.0) * (1.0 - land) * (1.0 - ice) * day;
        // warm sunrise band along the terminator
        float terminator = smoothstep(-0.12, 0.05, ndl) * (1.0 - smoothstep(0.05, 0.3, ndl));
        vec3 sunCol = mix(vec3(1.0, 0.72, 0.45), vec3(1.0, 0.97, 0.92), smoothstep(0.0, 0.35, ndl));
        vec3 col = albedo * (0.006 + day * 1.25) * sunCol + spec * 0.6 * sunCol;
        col += albedo * terminator * vec3(0.25, 0.12, 0.05);
        // sparse city lights on the night side, only on land
        // regional density falls off softly, settles near coasts, and resolves into fine scattered points
        float dens = smoothstep(0.4, 0.78, fbm(q * 5.0 + 3.0));
        float coast = 1.0 - smoothstep(uOceanLevel + 0.02, uOceanLevel + 0.16, h);
        dens *= 0.35 + 0.65 * coast;
        float spark = noise(q * 520.0) * 0.7 + noise(q * 140.0) * 0.3;
        float cities = dens * dens * smoothstep(0.64 - 0.16 * dens, 0.88, spark);
        float night = 1.0 - smoothstep(-0.25, 0.02, ndl);
        float habitable = land * (1.0 - ice) * night;
        col += uLights * cities * habitable * 4.5;
        col += uLights * dens * dens * habitable * 0.012;
        gl_FragColor = vec4(col, 1.0);
      }`,
  })
}

/** Cloud layer: separate sphere so clouds drift over the surface and cast a soft darkening. */
export function createCloudMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: sharedUniforms.uTime, uLight: { value: SUN_DIR.clone() }, uSeed: { value: 1 } },
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec3 vObj; varying vec3 vN;
      void main(){
        vObj = position;
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uLight; uniform float uSeed;
      varying vec3 vObj; varying vec3 vN;
      ${NOISE_GLSL}
      void main(){
        vec3 p = normalize(vObj);
        vec3 q = p * 3.2 + vec3(uTime * 0.006, uSeed * 4.0, uTime * 0.003);
        float swirl = fbm(q);
        float c = fbm(q * 2.6 + swirl * 1.8);
        float cover = smoothstep(0.5, 0.76, c) * smoothstep(0.35, 0.6, swirl + 0.1);
        float ndl = dot(normalize(vN), normalize(uLight));
        float day = smoothstep(-0.1, 0.3, ndl);
        vec3 col = mix(vec3(1.0, 0.75, 0.55), vec3(1.0), smoothstep(0.0, 0.3, ndl)) * (0.003 + day * 1.1);
        // clouds hide the city lights beneath them, so the night side stays legible
        gl_FragColor = vec4(col, cover * (0.72 - 0.5 * (1.0 - day)));
      }`,
  })
}

/** Atmosphere rim seen from outside, plus the thin haze seen across the disc. */
export function createAtmosphereMaterial(color = '#4ba9d8') {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uLight: { value: SUN_DIR.clone() } },
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
        float rim = 1.0 - abs(dot(normalize(vN), normalize(vView)));
        float shell = pow(rim, 3.2) * 1.6;
        float lit = smoothstep(-0.45, 0.5, dot(-normalize(vN), normalize(uLight)));
        vec3 col = uColor * (0.06 + 0.94 * lit) + vec3(1.0, 0.8, 0.6) * pow(lit, 6.0) * 0.5;
        gl_FragColor = vec4(col * shell, shell * (0.08 + lit * 0.92));
      }`,
  })
}

export function createHazeMaterial(color = '#4ba9d8') {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uLight: { value: SUN_DIR.clone() } },
    transparent: true,
    depthWrite: false,
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
        float f = pow(1.0 - max(dot(normalize(vN), normalize(vView)), 0.0), 2.2);
        float lit = smoothstep(-0.2, 0.4, dot(normalize(vN), normalize(uLight)));
        gl_FragColor = vec4(uColor * f * (0.15 + lit), f * (0.1 + lit * 0.55));
      }`,
  })
}

/** Deep-space backdrop: near-black with faint dust bands. Restrained on purpose. */
export function createNebulaMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: sharedUniforms.uTime },
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; varying vec3 vDir;
      ${NOISE_GLSL}
      void main(){
        vec3 d = normalize(vDir);
        float n = fbm(d * 2.2 + vec3(0.0, 0.0, uTime * 0.001));
        float m = fbm(d * 5.0 + n * 1.5);
        vec3 deep = vec3(0.009, 0.013, 0.022);
        float band = exp(-pow(d.y * 2.6 - d.x * 0.4 + 0.2, 2.0));
        vec3 dust = vec3(0.008, 0.012, 0.02) * band * smoothstep(0.4, 0.8, m);
        vec3 warm = vec3(0.016, 0.01, 0.008) * smoothstep(0.55, 0.9, n) * smoothstep(0.0, 1.0, -d.x * 0.5 + 0.4) * band;
        gl_FragColor = vec4(deep + dust + warm, 1.0);
      }`,
  })
}

/** Soft radial sprite used for the sun glare and engine halos. */
export function radialTexture(size = 256, inner = 0.0) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, inner * size, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.18, 'rgba(255,255,255,0.55)')
  g.addColorStop(0.5, 'rgba(255,255,255,0.12)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
