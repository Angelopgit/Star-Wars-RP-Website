import { useRef } from 'react'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'
import { droidDarkMat, droidMat, glowMat, gunMat } from './materials'

// Original stylized skeletal battle droid silhouette.
const geo = {
  thin: new THREE.CylinderGeometry(0.03, 0.03, 1, 6),
  joint: new THREE.SphereGeometry(0.045, 8, 6),
  foot: new THREE.BoxGeometry(0.1, 0.04, 0.2),
  pelvis: new THREE.BoxGeometry(0.22, 0.08, 0.12),
  chest: new THREE.BoxGeometry(0.28, 0.26, 0.1),
  pack: new THREE.BoxGeometry(0.22, 0.24, 0.12),
  head: new THREE.CylinderGeometry(0.05, 0.075, 0.34, 8),
  eye: new THREE.SphereGeometry(0.018, 6, 4),
  gun: new THREE.BoxGeometry(0.04, 0.06, 0.42),
}

type Props = ThreeElements['group'] & { phase?: number }

function Limb({ from, to }: { from: THREE.Vector3Tuple; to: THREE.Vector3Tuple }) {
  const a = new THREE.Vector3(...from)
  const b = new THREE.Vector3(...to)
  const mid = a.clone().add(b).multiplyScalar(0.5)
  const len = a.distanceTo(b)
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
  return <mesh geometry={geo.thin} material={droidMat} position={mid} quaternion={q} scale={[1, len, 1]} />
}

export function Droid({ phase = 0, ...rest }: Props) {
  const head = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase
    if (head.current) head.current.rotation.y = Math.sin(t * 0.9) * 0.3 * (Math.sin(t * 0.21) > 0.4 ? 1 : 0.15)
  })
  return (
    <group {...rest}>
      {[-1, 1].map((s) => (
        <group key={s}>
          <Limb from={[s * 0.08, 0.95, 0]} to={[s * 0.1, 0.5, 0.04]} />
          <Limb from={[s * 0.1, 0.5, 0.04]} to={[s * 0.1, 0.04, -0.02]} />
          <mesh geometry={geo.joint} material={droidDarkMat} position={[s * 0.1, 0.5, 0.04]} />
          <mesh geometry={geo.foot} material={droidMat} position={[s * 0.1, 0.02, 0.03]} />
        </group>
      ))}
      <mesh geometry={geo.pelvis} material={droidMat} position={[0, 0.97, 0]} />
      <Limb from={[0, 1.0, -0.02]} to={[0, 1.28, -0.04]} />
      <mesh geometry={geo.chest} material={droidMat} position={[0, 1.38, -0.02]} rotation={[0.15, 0, 0]} />
      <mesh geometry={geo.pack} material={droidDarkMat} position={[0, 1.38, -0.13]} rotation={[0.15, 0, 0]} />
      {/* arms holding a blaster */}
      <Limb from={[-0.17, 1.46, 0]} to={[-0.14, 1.22, 0.14]} />
      <Limb from={[-0.14, 1.22, 0.14]} to={[-0.02, 1.25, 0.34]} />
      <Limb from={[0.17, 1.46, 0]} to={[0.16, 1.2, 0.08]} />
      <Limb from={[0.16, 1.2, 0.08]} to={[0.04, 1.22, 0.22]} />
      <mesh geometry={geo.gun} material={gunMat} position={[0, 1.25, 0.3]} />
      <Limb from={[0, 1.5, -0.02]} to={[0, 1.66, 0.02]} />
      <group ref={head} position={[0, 1.7, 0.06]}>
        <mesh geometry={geo.head} material={droidMat} rotation={[Math.PI / 2 - 0.25, 0, 0]} position={[0, 0, 0.1]} />
        <mesh geometry={geo.eye} material={glowMat('#ff4636')} position={[-0.045, 0.03, 0.06]} />
        <mesh geometry={geo.eye} material={glowMat('#ff4636')} position={[0.045, 0.03, 0.06]} />
      </group>
    </group>
  )
}
