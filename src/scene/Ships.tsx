import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'
import { glowMat, hullDarkMat, hullMat, republicRedMat } from './materials'

function mulberry(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function wedge(len: number, width: number, depth: number, bevel = 0.3) {
  const s = new THREE.Shape()
  s.moveTo(0, len)
  s.lineTo(-width, -len * 0.55)
  s.lineTo(-width * 0.85, -len * 0.62)
  s.lineTo(width * 0.85, -len * 0.62)
  s.lineTo(width, -len * 0.55)
  s.closePath()
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 1 })
  g.rotateX(-Math.PI / 2)
  return g
}

/** Original wedge-shaped Republic-style capital ship with greebles and engine glow. */
export function CapitalShip({ seed = 3, ...rest }: ThreeElements['group'] & { seed?: number }) {
  const greebles = useRef<THREE.InstancedMesh>(null)
  const lights = useRef<THREE.InstancedMesh>(null)
  const parts = useMemo(
    () => ({
      lower: wedge(16, 5.6, 1.4),
      upper: wedge(13.5, 4.4, 1.0, 0.2),
      deck: wedge(9, 2.6, 0.5, 0.1),
      box: new THREE.BoxGeometry(1, 1, 1),
      tower: new THREE.BoxGeometry(0.9, 2.2, 1.6),
      bridge: new THREE.BoxGeometry(1.6, 0.35, 0.9),
      engine: new THREE.CylinderGeometry(0.7, 0.85, 1.2, 14),
      engineGlow: new THREE.CircleGeometry(0.66, 16),
      halo: new THREE.PlaneGeometry(4, 4),
      dot: new THREE.SphereGeometry(0.06, 4, 3),
    }),
    [],
  )

  useLayoutEffect(() => {
    const rnd = mulberry(seed)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    if (greebles.current) {
      for (let i = 0; i < greebles.current.count; i++) {
        const z = -9 + rnd() * 20
        const half = Math.max(0.3, (16 - z) * 0.26)
        const x = (rnd() * 2 - 1) * half * 0.85
        const sx = 0.2 + rnd() * 0.9
        const sy = 0.1 + rnd() * 0.35
        const sz = 0.2 + rnd() * 1.2
        m.compose(new THREE.Vector3(x, 2.5 + sy / 2, z), q, new THREE.Vector3(sx, sy, sz))
        greebles.current.setMatrixAt(i, m)
      }
      greebles.current.instanceMatrix.needsUpdate = true
    }
    if (lights.current) {
      for (let i = 0; i < lights.current.count; i++) {
        const z = -8 + rnd() * 22
        const side = rnd() > 0.5 ? 1 : -1
        const x = side * Math.max(0.2, (16 - z) * 0.345)
        m.compose(new THREE.Vector3(x, 0.4 + rnd() * 1.2, z), q, new THREE.Vector3(1, 1, 1))
        lights.current.setMatrixAt(i, m)
      }
      lights.current.instanceMatrix.needsUpdate = true
    }
  }, [seed])

  return (
    <group {...rest}>
      <mesh geometry={parts.lower} material={hullMat} />
      <mesh geometry={parts.upper} material={hullDarkMat} position={[0, 1.6, -0.8]} />
      <mesh geometry={parts.deck} material={hullMat} position={[0, 2.4, -2]} />
      {/* republic red accent along the dorsal line */}
      <mesh geometry={parts.box} material={republicRedMat} position={[0, 2.95, 4]} scale={[0.35, 0.06, 13]} />
      <mesh geometry={parts.box} material={republicRedMat} position={[-3.2, 1.45, 1]} rotation={[0, -0.33, 0]} scale={[0.2, 0.08, 9]} />
      <mesh geometry={parts.box} material={republicRedMat} position={[3.2, 1.45, 1]} rotation={[0, 0.33, 0]} scale={[0.2, 0.08, 9]} />
      {/* twin command towers */}
      {[-1.3, 1.3].map((x) => (
        <group key={x} position={[x, 3.6, -7.2]}>
          <mesh geometry={parts.tower} material={hullMat} />
          <mesh geometry={parts.bridge} material={hullDarkMat} position={[0, 1.2, 0.1]} />
          <mesh geometry={parts.dot} material={glowMat('#bfe6ff')} position={[0, 1.2, 0.56]} scale={[6, 1, 1]} />
        </group>
      ))}
      <instancedMesh ref={greebles} args={[parts.box, hullDarkMat, 70]} />
      <instancedMesh ref={lights} args={[parts.dot, glowMat('#cfe9ff'), 60]} />
      {/* engines */}
      {[-3, -1, 1, 3].map((x, i) => (
        <group key={x} position={[x, 1 + (i % 2) * 0.3, -10.2]}>
          <mesh geometry={parts.engine} material={hullDarkMat} rotation={[Math.PI / 2, 0, 0]} />
          <mesh geometry={parts.engineGlow} material={glowMat('#7cc4ff')} position={[0, 0, -0.62]} rotation={[0, Math.PI, 0]} />
          <mesh geometry={parts.halo} material={glowMat('#3d8bff', 0.35)} position={[0, 0, -0.9]} rotation={[0, Math.PI, 0]} />
        </group>
      ))}
    </group>
  )
}

/** Original bulbous Separatist-style cruiser silhouette. */
export function SeparatistCruiser(props: ThreeElements['group']) {
  const parts = useMemo(
    () => ({
      body: new THREE.CapsuleGeometry(2.2, 12, 6, 14),
      spine: new THREE.BoxGeometry(1, 1.4, 16),
      fin: new THREE.BoxGeometry(0.3, 4, 3),
      dot: new THREE.SphereGeometry(0.12, 6, 4),
      mat: new THREE.MeshStandardMaterial({ color: '#5a4a3e', roughness: 0.7, metalness: 0.35 }),
      mat2: new THREE.MeshStandardMaterial({ color: '#3a302a', roughness: 0.8, metalness: 0.3 }),
    }),
    [],
  )
  return (
    <group {...props}>
      <mesh geometry={parts.body} material={parts.mat} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.75]} />
      <mesh geometry={parts.spine} material={parts.mat2} position={[0, 1.8, 0]} />
      <mesh geometry={parts.fin} material={parts.mat2} position={[0, 3.2, -5]} />
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} geometry={parts.dot} material={glowMat('#ff5a3c')} position={[i % 2 ? 1.7 : -1.7, -0.3, -6 + i * 1.3]} />
      ))}
    </group>
  )
}

const fighterGeo = (() => {
  const g = new THREE.ConeGeometry(0.5, 2, 3)
  g.rotateX(Math.PI / 2)
  g.scale(1.4, 0.35, 1)
  return g
})()
const fighterMat = new THREE.MeshStandardMaterial({ color: '#c9ced6', roughness: 0.4, metalness: 0.6 })
const droidFighterMat = new THREE.MeshStandardMaterial({ color: '#8a6d52', roughness: 0.5, metalness: 0.5 })
const engineGeo = new THREE.SphereGeometry(0.16, 6, 4)

type FighterSpec = { r: number; speed: number; tilt: number; offset: number; y: number; enemy: boolean }

const X_AXIS = new THREE.Vector3(1, 0, 0)
function orbit(f: FighterSpec, a: number, out: THREE.Vector3) {
  return out.set(Math.cos(a) * f.r, f.y + Math.sin(a * 2) * 2, Math.sin(a) * f.r).applyAxisAngle(X_AXIS, f.tilt)
}

/** Starfighters looping through a battle zone, trading laser bolts. */
export function Battle({ count = 10, ...rest }: ThreeElements['group'] & { count?: number }) {
  const fighters = useMemo<FighterSpec[]>(() => {
    const rnd = mulberry(11)
    return Array.from({ length: count }, (_, i) => ({
      r: 10 + rnd() * 16,
      speed: 0.25 + rnd() * 0.25,
      tilt: (rnd() - 0.5) * 0.9,
      offset: rnd() * Math.PI * 2,
      y: (rnd() - 0.5) * 10,
      enemy: i % 2 === 1,
    }))
  }, [count])
  const refs = useRef<(THREE.Group | null)[]>([])
  const bolts = useRef<THREE.InstancedMesh>(null)
  const boltState = useMemo(
    () =>
      Array.from({ length: 40 }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), life: 0, red: false })),
    [],
  )
  const boltGeo = useMemo(() => {
    const g = new THREE.CapsuleGeometry(0.06, 1.6, 2, 6)
    g.rotateX(Math.PI / 2)
    return g
  }, [])
  const tmp = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      s: new THREE.Vector3(1, 1, 1),
      z: new THREE.Vector3(0, 0, 1),
      up: new THREE.Vector3(0, 1, 0),
      ahead: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      c: new THREE.Color(),
    }),
    [],
  )

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    fighters.forEach((f, i) => {
      const g = refs.current[i]
      if (!g) return
      const a = t * f.speed + f.offset
      orbit(f, a, g.position)
      orbit(f, a + 0.05, tmp.ahead)
      // Matrix4.lookAt points +z from target to eye, so pass ahead as the eye to face forward.
      tmp.m.lookAt(tmp.ahead, g.position, tmp.up)
      g.quaternion.setFromRotationMatrix(tmp.m)
    })
    // bolts
    const inst = bolts.current
    if (!inst) return
    boltState.forEach((b, i) => {
      b.life -= dt
      if (b.life <= 0) {
        const shooter = refs.current[Math.floor(Math.random() * fighters.length)]
        if (shooter) {
          b.p.copy(shooter.position)
          b.v.set(0, 0, 1).applyQuaternion(shooter.quaternion).multiplyScalar(60)
          b.red = fighters[refs.current.indexOf(shooter)].enemy
          b.life = 0.4 + Math.random() * 0.6
        }
      }
      b.p.addScaledVector(b.v, dt)
      tmp.q.setFromUnitVectors(tmp.z, tmp.dir.copy(b.v).normalize())
      tmp.m.compose(b.p, tmp.q, tmp.s)
      inst.setMatrixAt(i, tmp.m)
      inst.setColorAt(i, tmp.c.set(b.red ? '#ff4a3a' : '#59b8ff'))
    })
    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
  })

  return (
    <group {...rest}>
      {fighters.map((f, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)}>
          <mesh geometry={fighterGeo} material={f.enemy ? droidFighterMat : fighterMat} />
          <mesh geometry={engineGeo} material={glowMat(f.enemy ? '#ff6a3a' : '#7cc4ff')} position={[0, 0, -1]} />
        </group>
      ))}
      <instancedMesh ref={bolts} args={[boltGeo, undefined, boltState.length]}>
        <meshBasicMaterial toneMapped={false} blending={THREE.AdditiveBlending} transparent depthWrite={false} />
      </instancedMesh>
    </group>
  )
}
