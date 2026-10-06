import { useMemo, useRef } from 'react'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'
import { armorMat, battalionMat, gunMat, undersuitMat, visorMat } from './materials'

// Original stylized low-poly trooper built from primitives. No external models.
type Props = ThreeElements['group'] & {
  color: string
  phase?: number
  pose?: 'ready' | 'aim'
  march?: boolean
  override?: THREE.Material
  rank?: 'trooper' | 'officer'
}

const caps = (r: number, l: number) => new THREE.CapsuleGeometry(r, l, 4, 10)
const geo = {
  leg: caps(0.085, 0.34),
  shin: caps(0.08, 0.32),
  boot: new THREE.BoxGeometry(0.16, 0.1, 0.26),
  hip: new THREE.BoxGeometry(0.42, 0.14, 0.24),
  pouch: new THREE.BoxGeometry(0.08, 0.08, 0.06),
  torso: new THREE.CylinderGeometry(0.22, 0.18, 0.5, 8),
  chestBand: new THREE.BoxGeometry(0.4, 0.05, 0.05),
  abs: new THREE.BoxGeometry(0.24, 0.16, 0.06),
  neck: new THREE.CylinderGeometry(0.06, 0.07, 0.1, 8),
  helmet: new THREE.SphereGeometry(0.15, 16, 12),
  helmetBack: new THREE.CylinderGeometry(0.15, 0.17, 0.12, 14, 1, true),
  stripe: new THREE.TorusGeometry(0.152, 0.02, 6, 20, Math.PI),
  visorH: new THREE.BoxGeometry(0.2, 0.045, 0.05),
  visorV: new THREE.BoxGeometry(0.05, 0.11, 0.05),
  shoulder: new THREE.SphereGeometry(0.095, 10, 8),
  pauldron: new THREE.BoxGeometry(0.18, 0.05, 0.2),
  upperArm: caps(0.065, 0.2),
  foreArm: caps(0.06, 0.2),
  hand: new THREE.SphereGeometry(0.05, 8, 6),
  rifleBody: new THREE.BoxGeometry(0.06, 0.09, 0.55),
  rifleBarrel: new THREE.CylinderGeometry(0.018, 0.018, 0.3, 6),
  rifleScope: new THREE.CylinderGeometry(0.02, 0.02, 0.14, 6),
  backpack: new THREE.BoxGeometry(0.3, 0.32, 0.12),
  kama: new THREE.BoxGeometry(0.44, 0.3, 0.02),
}

export function CloneTrooper({ color, phase = 0, pose = 'ready', march = false, override, rank = 'trooper', ...rest }: Props) {
  const root = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const torso = useRef<THREE.Group>(null)
  const legL = useRef<THREE.Group>(null)
  const legR = useRef<THREE.Group>(null)

  const m = useMemo(() => {
    const accent = battalionMat(color)
    if (override) return { armor: override, under: override, visor: override, gun: override, accent: override }
    return { armor: armorMat, under: undersuitMat, visor: visorMat, gun: gunMat, accent }
  }, [color, override])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase
    if (torso.current) torso.current.scale.y = 1 + Math.sin(t * 1.6) * 0.008
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.35) * 0.18 + Math.sin(t * 0.13) * 0.1
      head.current.rotation.x = Math.sin(t * 0.27) * 0.04
    }
    if (march && legL.current && legR.current && root.current) {
      const s = Math.sin(t * 5)
      legL.current.rotation.x = s * 0.45
      legR.current.rotation.x = -s * 0.45
      root.current.position.y = Math.abs(Math.cos(t * 5)) * 0.03
    }
  })

  const aim = pose === 'aim'

  return (
    <group {...rest}>
      <group ref={root}>
        {/* legs */}
        {[-1, 1].map((side) => (
          <group key={side} ref={side < 0 ? legL : legR} position={[side * 0.11, 0.86, 0]}>
            <mesh geometry={geo.leg} material={m.armor} position={[0, -0.2, 0]} castShadow />
            <mesh geometry={geo.shin} material={m.armor} position={[0, -0.58, 0]} castShadow />
            <mesh geometry={geo.boot} material={m.under} position={[0, -0.81, 0.04]} />
          </group>
        ))}
        {/* hips and belt */}
        <mesh geometry={geo.hip} material={m.under} position={[0, 0.92, 0]} />
        {[-0.15, -0.05, 0.05, 0.15].map((x) => (
          <mesh key={x} geometry={geo.pouch} material={m.armor} position={[x, 0.92, 0.13]} />
        ))}
        {rank === 'officer' && <mesh geometry={geo.kama} material={m.accent} position={[0, 0.76, -0.02]} />}

        <group ref={torso} position={[0, 1.0, 0]}>
          <mesh geometry={geo.torso} material={m.armor} position={[0, 0.26, 0]} scale={[1, 1, 0.68]} castShadow />
          <mesh geometry={geo.chestBand} material={m.accent} position={[0, 0.38, 0.13]} />
          <mesh geometry={geo.abs} material={m.armor} position={[0, 0.08, 0.1]} />
          <mesh geometry={geo.backpack} material={m.under} position={[0, 0.3, -0.18]} />
          <mesh geometry={geo.neck} material={m.under} position={[0, 0.55, 0]} />

          {/* helmet */}
          <group ref={head} position={[0, 0.7, 0.01]}>
            <mesh geometry={geo.helmet} material={m.armor} scale={[1, 1.08, 1.06]} castShadow />
            <mesh geometry={geo.helmetBack} material={m.armor} position={[0, -0.1, 0]} />
            <mesh geometry={geo.stripe} material={m.accent} rotation={[0, Math.PI / 2, 0]} scale={[1.06, 1.08, 1]} />
            <mesh geometry={geo.visorH} material={m.visor} position={[0, 0.015, 0.14]} />
            <mesh geometry={geo.visorV} material={m.visor} position={[0, -0.05, 0.145]} />
          </group>

          {/* arms */}
          {[-1, 1].map((side) => {
            const right = side > 0
            const upperRot: [number, number, number] = aim
              ? right
                ? [-1.3, 0, -0.15]
                : [-1.45, 0, 0.5]
              : right
                ? [-0.3, 0, -0.1]
                : [-0.45, 0, 0.3]
            const foreRot: [number, number, number] = aim ? [-0.2, 0, 0] : right ? [-1.1, 0, -0.35] : [-1.2, 0, 0.55]
            return (
              <group key={side} position={[side * 0.27, 0.42, 0]}>
                <mesh geometry={geo.shoulder} material={m.armor} />
                {side < 0 && <mesh geometry={geo.pauldron} material={m.accent} position={[-0.02, 0.07, 0]} rotation={[0, 0, 0.35]} />}
                <group rotation={upperRot}>
                  <mesh geometry={geo.upperArm} material={m.under} position={[0, -0.16, 0]} />
                  <group position={[0, -0.3, 0]} rotation={foreRot}>
                    <mesh geometry={geo.foreArm} material={m.armor} position={[0, -0.14, 0]} />
                    <mesh geometry={geo.hand} material={m.under} position={[0, -0.28, 0]} />
                  </group>
                </group>
              </group>
            )
          })}

          {/* rifle */}
          <group
            position={aim ? [0.1, 0.42, 0.42] : [0.02, 0.25, 0.24]}
            rotation={aim ? [0, -0.05, 0] : [0.15, 0, -0.95]}
          >
            <mesh geometry={geo.rifleBody} material={m.gun} />
            <mesh geometry={geo.rifleBarrel} material={m.gun} position={[0, 0.01, 0.4]} rotation={[Math.PI / 2, 0, 0]} />
            <mesh geometry={geo.rifleScope} material={m.gun} position={[-0.05, 0.06, 0.05]} rotation={[Math.PI / 2, 0, 0]} />
          </group>
        </group>
      </group>
    </group>
  )
}
