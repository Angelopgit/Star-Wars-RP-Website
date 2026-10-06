import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'
import { glowMat, hullDarkMat, hullMat, hullPanelMat, radialTexture, republicRedMat, sepHullDarkMat, sepHullMat } from './materials'

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
  s.lineTo(-width * 0.55, len * 0.25)
  s.lineTo(-width, -len * 0.5)
  s.lineTo(-width * 0.9, -len * 0.62)
  s.lineTo(width * 0.9, -len * 0.62)
  s.lineTo(width, -len * 0.5)
  s.lineTo(width * 0.55, len * 0.25)
  s.closePath()
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2 })
  // Lay the wedge flat with the bow pointing along +z (engines and towers sit at negative z).
  g.rotateX(-Math.PI / 2)
  g.rotateY(Math.PI)
  return g
}

const haloTex = typeof document !== 'undefined' ? radialTexture(128) : null

/**
 * Original wedge-shaped Republic-style capital ship (not a licensed model): layered hull,
 * split dorsal flight deck, twin command towers, panel-line greebling and engine banks.
 */
export function CapitalShip({ seed = 3, lod = 'full', ...rest }: ThreeElements['group'] & { seed?: number; lod?: 'full' | 'far' }) {
  const greebles = useRef<THREE.InstancedMesh>(null)
  const panels = useRef<THREE.InstancedMesh>(null)
  const lights = useRef<THREE.InstancedMesh>(null)
  const parts = useMemo(
    () => ({
      lower: wedge(16, 5.4, 1.5),
      upper: wedge(13, 4.2, 1.0, 0.2),
      deckL: wedge(8.5, 1.15, 0.45, 0.08),
      box: new THREE.BoxGeometry(1, 1, 1),
      tower: new THREE.BoxGeometry(0.8, 2.4, 1.5),
      bridge: new THREE.BoxGeometry(1.5, 0.3, 0.8),
      engine: new THREE.CylinderGeometry(0.62, 0.78, 1.3, 16),
      engineGlow: new THREE.CircleGeometry(0.58, 20),
      halo: new THREE.PlaneGeometry(5, 5),
      dot: new THREE.SphereGeometry(0.032, 4, 3),
      haloMat: new THREE.MeshBasicMaterial({
        map: haloTex,
        color: '#7fb6ff',
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    }),
    [],
  )
  const far = lod === 'far'
  const counts = far ? { g: 24, p: 30, l: 12 } : { g: 90, p: 120, l: 44 }

  useLayoutEffect(() => {
    const rnd = mulberry(seed)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const place = (mesh: THREE.InstancedMesh | null, fn: (i: number) => void) => {
      if (!mesh) return
      for (let i = 0; i < mesh.count; i++) fn(i)
      mesh.instanceMatrix.needsUpdate = true
    }
    place(greebles.current, (i) => {
      const z = -9 + rnd() * 20
      const half = Math.max(0.3, (16 - z) * 0.24)
      const x = (rnd() * 2 - 1) * half * 0.9
      m.compose(new THREE.Vector3(x, 2.55 + rnd() * 0.2, z), q, new THREE.Vector3(0.2 + rnd() * 0.8, 0.08 + rnd() * 0.3, 0.3 + rnd() * 1.4))
      greebles.current!.setMatrixAt(i, m)
    })
    // panel lines: thin dark strips along the hull surfaces
    place(panels.current, (i) => {
      const z = -9.5 + rnd() * 24
      const half = Math.max(0.4, (16 - z) * 0.33)
      const x = (rnd() * 2 - 1) * half * 0.95
      const top = rnd() > 0.45
      const y = top ? 1.56 : -0.02
      m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(rnd() > 0.5 ? 0.04 : 0.6 + rnd() * 2.5, 0.02, rnd() > 0.5 ? 0.6 + rnd() * 2.5 : 0.04))
      panels.current!.setMatrixAt(i, m)
    })
    place(lights.current, (i) => {
      const z = -8 + rnd() * 22
      const side = rnd() > 0.5 ? 1 : -1
      const x = side * Math.max(0.2, (16 - z) * 0.335)
      m.compose(new THREE.Vector3(x, 0.3 + rnd() * 1.1, z), q, new THREE.Vector3(1, 1, 1))
      lights.current!.setMatrixAt(i, m)
    })
  }, [seed, counts.g, counts.p, counts.l])

  return (
    <group {...rest}>
      <mesh geometry={parts.lower} material={hullMat} castShadow receiveShadow />
      <mesh geometry={parts.upper} material={hullPanelMat} position={[0, 1.55, -0.9]} />
      {/* split flight deck doors */}
      <mesh geometry={parts.deckL} material={hullDarkMat} position={[-1.25, 2.5, -1.6]} />
      <mesh geometry={parts.deckL} material={hullDarkMat} position={[1.25, 2.5, -1.6]} />
      <mesh geometry={parts.box} material={republicRedMat} position={[-1.25, 2.98, 1.5]} scale={[0.12, 0.02, 11]} />
      <mesh geometry={parts.box} material={republicRedMat} position={[1.25, 2.98, 1.5]} scale={[0.12, 0.02, 11]} />
      <mesh geometry={parts.box} material={republicRedMat} position={[-3.1, 1.1, 0]} rotation={[0, -0.32, 0]} scale={[0.1, 0.05, 9]} />
      <mesh geometry={parts.box} material={republicRedMat} position={[3.1, 1.1, 0]} rotation={[0, 0.32, 0]} scale={[0.1, 0.05, 9]} />
      {/* twin command towers */}
      {[-1.25, 1.25].map((x) => (
        <group key={x} position={[x, 3.7, -7.4]}>
          <mesh geometry={parts.tower} material={hullPanelMat} />
          <mesh geometry={parts.bridge} material={hullDarkMat} position={[0, 1.3, 0.1]} />
          <mesh geometry={parts.dot} material={glowMat('#cfe3ff')} position={[0, 1.3, 0.52]} scale={[8, 1.2, 1]} />
        </group>
      ))}
      <instancedMesh ref={greebles} args={[parts.box, hullDarkMat, counts.g]} />
      <instancedMesh ref={panels} args={[parts.box, hullDarkMat, counts.p]} />
      <instancedMesh ref={lights} args={[parts.dot, glowMat('#ffe2b8', 0.75), counts.l]} />
      {/* engine banks */}
      {[-3.1, -1.05, 1.05, 3.1].map((x, i) => (
        <group key={x} position={[x, 0.9 + (i === 1 || i === 2 ? 0.35 : 0), -10.3]}>
          <mesh geometry={parts.engine} material={hullDarkMat} rotation={[Math.PI / 2, 0, 0]} />
          <mesh geometry={parts.engineGlow} material={glowMat('#8fc3ff')} position={[0, 0, -0.68]} rotation={[0, Math.PI, 0]} />
          {!far && <mesh geometry={parts.halo} material={parts.haloMat} position={[0, 0, -1.1]} rotation={[0, Math.PI, 0]} />}
        </group>
      ))}
    </group>
  )
}

/** Original bulbous Separatist-style cruiser silhouette. */
export function SeparatistCruiser(props: ThreeElements['group']) {
  const parts = useMemo(
    () => ({
      body: new THREE.CapsuleGeometry(2.2, 12, 8, 18),
      spine: new THREE.BoxGeometry(1, 1.4, 16),
      fin: new THREE.BoxGeometry(0.3, 4, 3),
      ring: new THREE.TorusGeometry(3.1, 0.35, 8, 40),
      dot: new THREE.SphereGeometry(0.1, 6, 4),
    }),
    [],
  )
  return (
    <group {...props}>
      <mesh geometry={parts.body} material={sepHullMat} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.75]} />
      <mesh geometry={parts.spine} material={sepHullDarkMat} position={[0, 1.8, 0]} />
      <mesh geometry={parts.fin} material={sepHullDarkMat} position={[0, 3.2, -5]} />
      <mesh geometry={parts.ring} material={sepHullDarkMat} position={[0, 0, 3]} />
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} geometry={parts.dot} material={glowMat('#ff7a4a')} position={[i % 2 ? 1.7 : -1.7, -0.3, -6 + i * 1.3]} />
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
const fighterMat = new THREE.MeshStandardMaterial({ color: '#9aa3ad', roughness: 0.5, metalness: 0.6 })
const droidFighterMat = new THREE.MeshStandardMaterial({ color: '#5a4639', roughness: 0.6, metalness: 0.5 })
const engineGeo = new THREE.SphereGeometry(0.14, 6, 4)

type FighterSpec = { r: number; speed: number; tilt: number; offset: number; y: number; enemy: boolean }
const X_AXIS = new THREE.Vector3(1, 0, 0)
function orbit(f: FighterSpec, a: number, out: THREE.Vector3) {
  return out.set(Math.cos(a) * f.r, f.y + Math.sin(a * 2) * 2, Math.sin(a) * f.r).applyAxisAngle(X_AXIS, f.tilt)
}

/** Starfighters weaving through a battle zone, trading restrained laser fire. */
export function Battle({ count = 10, ...rest }: ThreeElements['group'] & { count?: number }) {
  const fighters = useMemo<FighterSpec[]>(() => {
    const rnd = mulberry(11)
    return Array.from({ length: count }, (_, i) => ({
      r: 10 + rnd() * 16,
      speed: 0.18 + rnd() * 0.2,
      tilt: (rnd() - 0.5) * 0.9,
      offset: rnd() * Math.PI * 2,
      y: (rnd() - 0.5) * 10,
      enemy: i % 2 === 1,
    }))
  }, [count])
  const refs = useRef<(THREE.Group | null)[]>([])
  const bolts = useRef<THREE.InstancedMesh>(null)
  const boltState = useMemo(() => Array.from({ length: 24 }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), life: 0, red: false })), [])
  const boltGeo = useMemo(() => {
    const g = new THREE.CapsuleGeometry(0.05, 1.4, 2, 6)
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
      tmp.m.lookAt(tmp.ahead, g.position, tmp.up)
      g.quaternion.setFromRotationMatrix(tmp.m)
    })
    const inst = bolts.current
    if (!inst) return
    boltState.forEach((b, i) => {
      b.life -= dt
      if (b.life <= 0) {
        const idx = Math.floor(Math.random() * fighters.length)
        const shooter = refs.current[idx]
        if (shooter) {
          b.p.copy(shooter.position)
          b.v.set(0, 0, 1).applyQuaternion(shooter.quaternion).multiplyScalar(55)
          b.red = fighters[idx].enemy
          b.life = 0.5 + Math.random() * 0.9
        }
      }
      b.p.addScaledVector(b.v, dt)
      tmp.q.setFromUnitVectors(tmp.z, tmp.dir.copy(b.v).normalize())
      tmp.m.compose(b.p, tmp.q, tmp.s)
      inst.setMatrixAt(i, tmp.m)
      inst.setColorAt(i, tmp.c.set(b.red ? '#ff5a3a' : '#6fb4ff'))
    })
    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
  })

  return (
    <group {...rest}>
      {fighters.map((f, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)}>
          <mesh geometry={fighterGeo} material={f.enemy ? droidFighterMat : fighterMat} />
          <mesh geometry={engineGeo} material={glowMat(f.enemy ? '#ff7a4a' : '#8fc3ff')} position={[0, 0, -1]} />
        </group>
      ))}
      <instancedMesh ref={bolts} args={[boltGeo, undefined, boltState.length]}>
        <meshBasicMaterial toneMapped={false} blending={THREE.AdditiveBlending} transparent depthWrite={false} fog={false} />
      </instancedMesh>
    </group>
  )
}

/** A four-ship flight in echelon, used for the patrol and for scale against the capital ship. */
export function FighterFlight(props: ThreeElements['group']) {
  return (
    <group {...props}>
      {[
        [0, 0, 0],
        [-1.4, -0.3, -1.6],
        [1.4, -0.2, -1.6],
        [-2.8, -0.6, -3.2],
      ].map((p, i) => (
        <group key={i} position={p as THREE.Vector3Tuple}>
          <mesh geometry={fighterGeo} material={fighterMat} scale={0.6} />
          <mesh geometry={engineGeo} material={glowMat('#8fc3ff')} position={[0, 0, -0.6]} scale={0.6} />
        </group>
      ))}
    </group>
  )
}

/** A patrol flight crossing the frame slowly. */
export function Patrol({ path, ...rest }: ThreeElements['group'] & { path: [THREE.Vector3Tuple, THREE.Vector3Tuple] }) {
  const g = useRef<THREE.Group>(null)
  const a = useMemo(() => new THREE.Vector3(...path[0]), [path])
  const b = useMemo(() => new THREE.Vector3(...path[1]), [path])
  const dir = useMemo(() => b.clone().sub(a).normalize(), [a, b])
  useFrame(({ clock }) => {
    if (!g.current) return
    const t = (clock.elapsedTime * 0.028) % 1
    g.current.position.lerpVectors(a, b, t)
    g.current.lookAt(g.current.position.clone().add(dir))
  })
  return (
    <group {...rest}>
      <FighterFlight ref={g} />
    </group>
  )
}
