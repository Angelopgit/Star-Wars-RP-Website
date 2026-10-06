import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { BATTALIONS } from '../content/factions'
import { PLANETS } from '../content/planets'
import { useHoloColor, usePlanetId } from '../lib/hooks'
import { currentBlend, scroll } from '../lib/scroll'
import { CloneTrooper } from './CloneTrooper'
import { Droid } from './Droid'
import { createHologramMaterial, createNebulaMaterial, glowMat, padMat, sharedUniforms } from './materials'
import { Planet } from './Planet'
import { StaticBackdrop } from '../components/StaticBackdrop'
import { Battle, CapitalShip, SeparatistCruiser } from './Ships'

type Shot = { pos: THREE.Vector3Tuple; look: THREE.Vector3Tuple }

// One camera shot per page section (matched by data-shot). Scrolling glides between them.
const SHOTS: Record<string, Shot> = {
  hero: { pos: [-3.5, 2.0, 13.5], look: [3.5, 2.2, -8] },
  about: { pos: [-9, 9, 6], look: [-26, 20, -60] },
  factions: { pos: [18, 2.4, -4], look: [23, -1.2, -15.5] },
  character: { pos: [-21.5, 2.4, 9.5], look: [-27.4, 1.9, 4] },
  progression: { pos: [-29.5, 3.6, 8.5], look: [-25.4, 2.8, 4] },
  galaxy: { pos: [-14, 32, -318], look: [10, 30, -400] },
  features: { pos: [12, 32, -18], look: [-30, 22, -72] },
  events: { pos: [68, 17, -116], look: [95, 21, -160] },
  philosophy: { pos: [3.2, 1.7, 4.4], look: [-0.6, 1.55, -0.5] },
  community: { pos: [0, 5.5, 20], look: [-4, 4, -10] },
  roadmap: { pos: [-6, 38, -6], look: [-30, 20, -72] },
  media: { pos: [18, 8, -55], look: [44, -26, -180] },
  news: { pos: [-62, 30, -30], look: [-30, 22, -72] },
  'how-to-play': { pos: [0, 1.5, 8.5], look: [0, 1.7, -2] },
  why: { pos: [-7, 2.2, 9], look: [2, 2, -8] },
  footer: { pos: [0, 0.7, 12], look: [0, 3.2, -20] },
}

// Portrait framing for phones; shots not listed here are pulled back instead.
const SHOTS_MOBILE: Partial<Record<string, Shot>> = {
  hero: { pos: [0, 2.8, 12.5], look: [0, 0.6, -3] },
  factions: { pos: [16, 2.2, 2], look: [25, -0.5, -14] },
  galaxy: { pos: [-10, 40, -250], look: [10, 16, -400] },
  philosophy: { pos: [0, 3.8, 8], look: [0, -0.2, -3] },
  'how-to-play': { pos: [0, 2.4, 11], look: [0, 0.9, -2] },
  footer: { pos: [0, 1.2, 14], look: [12, 10, -30] },
}

const v = new THREE.Vector3()
const l = new THREE.Vector3()

function CameraRig({ animated, mobile }: { animated: boolean; mobile: boolean }) {
  const camera = useThree((s) => s.camera)
  const pointer = useRef({ x: 0, y: 0 })
  const look = useRef(new THREE.Vector3(...SHOTS.hero.look))

  useEffect(() => {
    camera.position.set(...SHOTS.hero.pos)
    camera.lookAt(look.current)
    if (!animated || mobile) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [camera, animated, mobile])

  useFrame(({ clock }, dt) => {
    sharedUniforms.uTime.value = clock.elapsedTime
    if (!animated) return
    const { from, to, t } = currentBlend()
    const pick = (id: string): [Shot, boolean] => {
      const m = mobile ? SHOTS_MOBILE[id] : undefined
      return m ? [m, true] : [SHOTS[id] ?? SHOTS.hero, false]
    }
    const [a, aFramed] = pick(from)
    const [b, bFramed] = pick(to)
    v.set(...a.pos).lerp(l.set(...b.pos), t)
    const targetLook = new THREE.Vector3(...a.look).lerp(l.set(...b.look), t)
    // Mobile is portrait: shots without a portrait framing get pulled back so subjects stay in frame.
    if (mobile) {
      const pull = 1 + 0.35 * (1 - THREE.MathUtils.lerp(aFramed ? 1 : 0, bFramed ? 1 : 0, t))
      v.sub(targetLook).multiplyScalar(pull).add(targetLook)
    }
    const time = clock.elapsedTime
    v.x += Math.sin(time * 0.21) * 0.25 + pointer.current.x * 0.6
    v.y += Math.sin(time * 0.17) * 0.15 - pointer.current.y * 0.35
    const k = 1 - Math.exp(-dt * 2.2)
    camera.position.lerp(v, k)
    look.current.lerp(targetLook, k)
    camera.lookAt(look.current)
  })
  return null
}

function Squad({ mobile }: { mobile: boolean }) {
  // V formation with a commander at the tip. Battalions mixed so each color reads.
  const slots = useMemo(() => {
    const rows: { x: number; z: number; b: number; officer?: boolean; aim?: boolean }[] = [{ x: 0, z: 0.6, b: 0, officer: true }]
    const count = mobile ? 6 : 12
    for (let i = 1; i < count; i++) {
      const side = i % 2 ? -1 : 1
      const step = Math.ceil(i / 2)
      rows.push({ x: side * step * 1.25, z: -step * 1.1, b: i % BATTALIONS.length, aim: step === 3 })
    }
    return rows
  }, [mobile])
  return (
    <group>
      {slots.map((s, i) => (
        <CloneTrooper
          key={i}
          position={[s.x, 0, s.z]}
          rotation={[0, -s.x * 0.04, 0]}
          color={BATTALIONS[s.b].color}
          rank={s.officer ? 'officer' : 'trooper'}
          pose={s.aim ? 'aim' : 'ready'}
          phase={i * 1.7}
        />
      ))}
    </group>
  )
}

function LandingPad() {
  const ring = useMemo(() => new THREE.TorusGeometry(1, 0.012, 6, 96), [])
  const disc = useMemo(() => new THREE.CylinderGeometry(11, 11.6, 0.4, 64), [])
  const line = useMemo(() => new THREE.BoxGeometry(0.05, 0.01, 6), [])
  return (
    <group>
      <mesh geometry={disc} material={padMat} position={[0, -0.2, -2]} receiveShadow />
      {[4, 7.5, 10.6].map((r) => (
        <mesh key={r} geometry={ring} material={glowMat('#4fb2ff', 0.7)} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, -2]} scale={r} />
      ))}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} geometry={line} material={glowMat('#4fb2ff', 0.5)} position={[x * 4, 0.01, 4.5]} />
      ))}
    </group>
  )
}

function DroidLine({ mobile }: { mobile: boolean }) {
  const n = mobile ? 8 : 18
  const disc = useMemo(() => new THREE.CylinderGeometry(5.5, 6, 0.3, 48), [])
  const ring = useMemo(() => new THREE.TorusGeometry(5.2, 0.012, 6, 96), [])
  return (
    <group position={[24, 0, -12]} rotation={[0, -Math.PI / 2 - 0.35, 0]}>
      <mesh geometry={disc} material={padMat} position={[0, -0.15, -0.7]} />
      <mesh geometry={ring} material={glowMat('#ff5a4f', 0.6)} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, -0.7]} />
      {Array.from({ length: n }).map((_, i) => (
        <Droid key={i} position={[(i % 6) * 1.1 - 3, 0, -Math.floor(i / 6) * 1.4]} phase={i * 0.9} />
      ))}
      <pointLight color="#ff3b2f" intensity={30} distance={18} position={[0, 4, 3]} />
    </group>
  )
}

function HoloStation() {
  const holo = useMemo(() => createHologramMaterial('#5cc8ff'), [])
  const color = useHoloColor()
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    holo.uniforms.uColor.value.set(color)
    invalidate()
  }, [color, holo, invalidate])
  const spin = useRef<THREE.Group>(null)
  const rings = useRef<THREE.Group>(null)
  const base = useMemo(() => new THREE.CylinderGeometry(1.1, 1.3, 0.6, 32), [])
  const emitter = useMemo(() => new THREE.CylinderGeometry(0.8, 0.8, 0.04, 32), [])
  const cone = useMemo(() => new THREE.CylinderGeometry(0.75, 0.15, 3.6, 32, 1, true), [])
  const rank = useMemo(() => new THREE.TorusGeometry(1.25, 0.015, 6, 64), [])
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.45
    if (rings.current) rings.current.children.forEach((c, i) => (c.rotation.z += dt * (0.2 + i * 0.15) * (i % 2 ? -1 : 1)))
  })
  return (
    <group position={[-26, 0, 4]}>
      <mesh geometry={base} material={padMat} position={[0, 0.3, 0]} />
      <mesh geometry={emitter} material={glowMat('#5cc8ff', 0.9)} position={[0, 0.62, 0]} />
      <mesh geometry={cone} material={glowMat('#2f8fff', 0.07)} position={[0, 2.4, 0]} />
      <group ref={spin} position={[0, 0.65, 0]} scale={1.25}>
        <CloneTrooper color="#5cc8ff" override={holo} rank="officer" />
      </group>
      <group ref={rings} position={[0, 0, 0]}>
        {[1.2, 2.2, 3.2].map((y, i) => (
          <mesh key={y} geometry={rank} material={glowMat(i === 2 ? '#ffc457' : '#5cc8ff', 0.75)} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} scale={1 + i * 0.12} />
        ))}
      </group>
      <pointLight color="#4fb2ff" intensity={20} distance={10} position={[0, 2, 1]} />
    </group>
  )
}

function GalaxyPlanet() {
  const id = usePlanetId()
  const p = PLANETS.find((x) => x.id === id) ?? PLANETS[0]
  const seed = PLANETS.indexOf(p) * 3.7 + 1
  return (
    <group>
      <Planet position={[10, 30, -400]} radius={30} colors={p.colors} atmosphere={p.atmosphere} seed={seed} spin={0.03} ring={p.id === 'geonosis'} />
      <Planet position={[-30, 50, -460]} radius={5} colors={['#2a2a34', '#7a7f8c', '#c8ccd4']} atmosphere="#9aa8c0" seed={9} />
      <Planet position={[60, 10, -440]} radius={3} colors={['#3a2014', '#8a5a3a', '#d4a070']} atmosphere="#ffb080" seed={4} />
    </group>
  )
}

function World({ mobile, animated }: { mobile: boolean; animated: boolean }) {
  const nebula = useMemo(() => createNebulaMaterial(), [])
  const sky = useMemo(() => new THREE.SphereGeometry(900, 32, 16), [])
  const ship = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ship.current && animated) ship.current.position.z = -70 + Math.sin(clock.elapsedTime * 0.05) * 6
  })
  return (
    <>
      <mesh geometry={sky} material={nebula} />
      <Stars radius={300} depth={200} count={mobile ? 2500 : 6000} factor={5} saturation={0.2} fade speed={animated ? 0.6 : 0} />

      <ambientLight intensity={0.25} color="#8fa8d8" />
      <hemisphereLight args={['#6f8fd0', '#0a0d16', 0.35]} />
      <directionalLight position={[-30, 25, 40]} intensity={2.2} color="#f2f6ff" />
      {/* cinematic rim lights: Republic blue left, Separatist red right */}
      <pointLight position={[-7, 4, -4]} intensity={60} distance={30} color="#3d8bff" />
      <pointLight position={[7, 3, -5]} intensity={40} distance={26} color="#ff4a3a" />
      <spotLight position={[0, 9, 9]} angle={0.6} penumbra={0.8} intensity={80} distance={40} color="#dfe9ff" />

      <LandingPad />
      <Squad mobile={mobile} />
      <DroidLine mobile={mobile} />
      <HoloStation />

      <Planet position={[46, -30, -190]} radius={85} colors={['#0d2a3a', '#3f8fb0', '#d8eef4']} atmosphere="#7fd0ff" seed={2} />
      <group ref={ship} position={[-30, 22, -70]} rotation={[0.04, 0.55, -0.08]}>
        <CapitalShip scale={2.2} />
      </group>
      <CapitalShip position={[70, 45, -260]} rotation={[0, -0.9, 0.05]} scale={2} seed={7} />
      <SeparatistCruiser position={[95, 22, -160]} rotation={[0, -0.4, 0.1]} scale={1.6} />
      <Battle position={[66, 15, -132]} count={mobile ? 6 : 12} />

      <GalaxyPlanet />
    </>
  )
}

class GLBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export default function Experience({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const animated = !reduced
  useEffect(() => {
    const onScroll = () => (scroll.y = window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="scene-layer" aria-hidden>
      <GLBoundary fallback={<StaticBackdrop />}>
        <Canvas
          dpr={mobile ? [1, 1.25] : [1, 1.75]}
          frameloop={animated ? 'always' : 'demand'}
          camera={{ fov: mobile ? 62 : 42, near: 0.1, far: 2000, position: SHOTS.hero.pos }}
          gl={{ antialias: !mobile, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.1
          }}
        >
          <color attach="background" args={['#02040a']} />
          <Suspense fallback={null}>
            <World mobile={mobile} animated={animated} />
          </Suspense>
          <CameraRig animated={animated} mobile={mobile} />
        </Canvas>
      </GLBoundary>
      <div className="scene-vignette" />
    </div>
  )
}
