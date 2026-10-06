/**
 * Offline render harness. Not part of the deployed site.
 *
 * Serves a deterministic version of the cinematic scene so `tools/render/render.mjs` can
 * step through time with Playwright, screenshot each frame, and encode the hero loop video
 * and the section stills with ffmpeg. Everything that moves is a periodic function of the
 * loop phase so the last frame leads seamlessly into the first.
 */
import { StrictMode, useEffect, useMemo, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { SUN_DIR, createNebulaMaterial, radialTexture, sharedUniforms } from '../../src/scene/materials'
import { Planet, type PlanetLook } from '../../src/scene/Planet'
import { Battle, CapitalShip, FighterFlight, SeparatistCruiser } from '../../src/scene/Ships'

declare global {
  interface Window {
    __ready?: boolean
    __render?: (t: number, shot?: string) => Promise<void>
  }
}

const TAU = Math.PI * 2
// The sun sits just behind the planet's limb so the whole frame is backlit: hulls read as
// silhouettes with a bright rim, the atmosphere glows, and the night side shows city lights.
SUN_DIR.set(0.34, -0.27, -1).normalize()
const PLANET_POS: THREE.Vector3Tuple = [40, -392, -300]
const PLANET_ROT: THREE.Vector3Tuple = [1.4, 2.6, 0.4]
const HERO_LOOK: PlanetLook = { ocean: '#0a2550', land: '#2c3a2a', high: '#7c7f72', atmosphere: '#4ba9d8', lights: '#ffd2a0', oceanLevel: 0.57, ice: 0.82 }

type Shot = { pos: THREE.Vector3Tuple; look: THREE.Vector3Tuple }
const SHOTS: Record<string, Shot> = {
  hero: { pos: [0, 0, 0], look: [0, -6, -100] },
  'hero-mobile': { pos: [0, 0, 0], look: [14, -10, -100] },
  galaxy: { pos: [1000, -330, 24], look: [-82, -332, -82] },
  fleet: { pos: [-30, 10, 20], look: [20, -8, -140] },
  deck: { pos: [14, 10, -84], look: [60, -16, -200] },
  warzone: { pos: [280, 26, -325], look: [380, 20, -420] },
  wide: { pos: [-40, 20, 40], look: [20, -20, -120] },
  night: { pos: [-110, -300, 150], look: [40, -392, -300] },
}

const rig = { flagship: null as THREE.Group | null, flight: null as THREE.Group | null }

function Sun() {
  const tex = useMemo(() => radialTexture(256), [])
  const pos = useMemo(() => SUN_DIR.clone().multiplyScalar(1400), [])
  return (
    <sprite position={pos} scale={[260, 260, 1]}>
      <spriteMaterial map={tex} color="#ffe7c4" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} fog={false} />
    </sprite>
  )
}

function Dust({ count }: { count: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    let s = 7
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rnd() - 0.5) * 220
      pos[i * 3 + 1] = (rnd() - 0.5) * 120
      pos[i * 3 + 2] = 40 - rnd() * 320
      seed[i] = rnd() * 100
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('seed', new THREE.BufferAttribute(seed, 1))
    return g
  }, [count])
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: sharedUniforms.uTime },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          attribute float seed; uniform float uTime; varying float vA;
          void main(){
            vec3 p = position;
            p.x += sin(uTime * 0.5 + seed) * 2.0;
            p.y += cos(uTime * 0.4 + seed * 1.3) * 1.5;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            float d = -mv.z;
            gl_PointSize = clamp(90.0 / d, 0.6, 2.6);
            vA = smoothstep(260.0, 40.0, d) * (0.35 + 0.65 * fract(seed * 0.37));
          }`,
        fragmentShader: /* glsl */ `
          varying float vA;
          void main(){
            float r = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.1, r) * vA * 0.35;
            gl_FragColor = vec4(0.62, 0.72, 0.85, a);
          }`,
      }),
    [],
  )
  return <points geometry={geo} material={mat} frustumCulled={false} />
}

/** Exposes a deterministic render(t, shot) to the Playwright driver. */
function Driver() {
  const { camera, advance, invalidate } = useThree()
  const look = useRef(new THREE.Vector3())
  useEffect(() => {
    window.__render = async (t: number, shotName = 'hero') => {
      const phase = t * TAU
      const shot = SHOTS[shotName] ?? SHOTS.hero
      const drift = shotName.startsWith('hero') ? 1 : 0
      // Bounded, periodic "time" so shader motion (clouds, dust) loops cleanly.
      sharedUniforms.uTime.value = 2.4 * Math.sin(phase) + 0.8 * Math.sin(phase * 2 + 1.0)
      camera.position.set(shot.pos[0] + drift * 1.4 * Math.sin(phase), shot.pos[1] + drift * 0.7 * Math.sin(phase + 1.3), shot.pos[2] + drift * 2.2 * Math.sin(phase + 2.1))
      look.current.set(shot.look[0] + drift * 1.2 * Math.sin(phase + 0.6), shot.look[1] + drift * 0.8 * Math.sin(phase + 2.0), shot.look[2])
      camera.lookAt(look.current)
      if (rig.flagship) {
        rig.flagship.position.set(24 + 0.6 * Math.sin(phase + 0.3), -5 + 0.7 * Math.sin(phase), -112 + 1.8 * Math.sin(phase + 0.9))
        rig.flagship.rotation.set(0.03, -0.62, -0.05 + 0.01 * Math.sin(phase + 0.4))
      }
      if (rig.flight) {
        // Crosses from outside the left edge to beyond the right edge over one loop, so no seam.
        const a = new THREE.Vector3(-60, -14, -60)
        const b = new THREE.Vector3(70, -2, -170)
        rig.flight.position.lerpVectors(a, b, t)
        rig.flight.lookAt(b.clone().add(b.clone().sub(a)))
      }
      invalidate()
      advance(performance.now(), true)
      await new Promise((r) => requestAnimationFrame(() => r(null)))
    }
    window.__ready = true
  }, [camera, advance, invalidate])
  return null
}

function Scene() {
  const nebula = useMemo(() => createNebulaMaterial(), [])
  const sky = useMemo(() => new THREE.SphereGeometry(1800, 32, 16), [])
  const sunPos = useMemo(() => SUN_DIR.clone().multiplyScalar(600), [])
  return (
    <>
      <mesh geometry={sky} material={nebula} />
      <Stars radius={600} depth={500} count={6000} factor={4} saturation={0} fade speed={0} />
      <Sun />
      <ambientLight intensity={0.06} color="#5c7aa6" />
      <hemisphereLight args={['#1d2a40', '#06080d', 0.35]} />
      <directionalLight position={sunPos} intensity={3.4} color="#fff0dc" />
      <directionalLight position={[120, -200, -200]} intensity={0.5} color="#2e5a8a" />
      {/* faint fill from the camera side so the silhouettes keep a hint of hull detail */}
      <directionalLight position={[-90, 120, 300]} intensity={0.32} color="#6f88a8" />

      <group ref={(g) => (rig.flagship = g)} position={[24, -5, -112]} rotation={[0.03, -0.62, -0.05]}>
        <CapitalShip scale={3.1} />
      </group>
      <FighterFlight ref={(g) => (rig.flight = g)} />
      <CapitalShip position={[-120, -22, -420]} rotation={[0, -0.4, 0.02]} scale={2.6} seed={7} lod="far" />
      <CapitalShip position={[110, -34, -520]} rotation={[0.02, -1.0, 0]} scale={2.4} seed={9} lod="far" />
      <CapitalShip position={[-30, -48, -640]} rotation={[0, 0.3, 0]} scale={2.2} seed={13} lod="far" />
      <group position={[380, 20, -420]}>
        <SeparatistCruiser position={[26, 4, -36]} rotation={[0, -0.5, 0.08]} scale={2.2} />
        <SeparatistCruiser position={[70, -10, -90]} rotation={[0, -0.3, 0.02]} scale={1.8} />
        <CapitalShip position={[-40, -4, 10]} rotation={[0.02, 0.9, 0]} scale={2.2} seed={5} lod="far" />
        <Battle count={12} />
        <pointLight position={[10, 6, -10]} intensity={180} distance={120} color="#ff5a3a" decay={1.6} />
      </group>
      <Planet position={PLANET_POS} rotation={PLANET_ROT} radius={300} look={HERO_LOOK} seed={4.2} spin={0} detail={160} />
      <Dust count={700} />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Canvas
      dpr={1}
      frameloop="never"
      camera={{ fov: 40, near: 0.5, far: 4000, position: SHOTS.hero.pos }}
      gl={{ antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.0
      }}
    >
      <color attach="background" args={['#05080d']} />
      <fog attach="fog" args={['#070b12', 90, 950]} />
      <Scene />
      <Driver />
      <EffectComposer multisampling={4} enableNormalPass={false}>
        <Bloom intensity={0.5} luminanceThreshold={0.82} luminanceSmoothing={0.25} mipmapBlur />
        <Noise opacity={0.05} blendFunction={BlendFunction.SOFT_LIGHT} />
        <Vignette offset={0.22} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  </StrictMode>,
)
