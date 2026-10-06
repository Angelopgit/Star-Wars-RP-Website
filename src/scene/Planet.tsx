import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'
import { createAtmosphereMaterial, createPlanetMaterial } from './materials'

type Props = ThreeElements['group'] & {
  radius: number
  colors: [string, string, string]
  atmosphere: string
  seed?: number
  spin?: number
  ring?: boolean
}

/** Procedural planet. Colors ease toward new values so switching planets feels like a transition. */
export function Planet({ radius, colors, atmosphere, seed = 1, spin = 0.01, ring = false, ...rest }: Props) {
  const body = useRef<THREE.Mesh>(null)
  const invalidate = useThree((s) => s.invalidate)
  const mat = useMemo(() => {
    const m = createPlanetMaterial()
    colors.forEach((c, i) => m.uniforms[`uC${i + 1}`].value.set(c))
    return m
  }, [])
  const atmo = useMemo(() => createAtmosphereMaterial(atmosphere), [])
  const target = useMemo(() => ({ c: colors.map((c) => new THREE.Color(c)), a: new THREE.Color(atmosphere) }), [])
  const geo = useMemo(() => new THREE.SphereGeometry(1, 64, 48), [])
  const ringGeo = useMemo(() => new THREE.RingGeometry(1.35, 2.1, 96), [])
  const ringMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#9fb6d6', transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }),
    [],
  )

  useEffect(() => {
    target.c.forEach((c, i) => c.set(colors[i]))
    target.a.set(atmosphere)
    mat.uniforms.uSeed.value = seed
    invalidate()
  }, [colors, atmosphere, seed, target, mat, invalidate])

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 2.5)
    mat.uniforms.uC1.value.lerp(target.c[0], k)
    mat.uniforms.uC2.value.lerp(target.c[1], k)
    mat.uniforms.uC3.value.lerp(target.c[2], k)
    atmo.uniforms.uColor.value.lerp(target.a, k)
    if (body.current) body.current.rotation.y += dt * spin
  })

  return (
    <group {...rest} scale={radius}>
      <mesh ref={body} geometry={geo} material={mat} />
      <mesh geometry={geo} material={atmo} scale={1.06} />
      {ring && <mesh geometry={ringGeo} material={ringMat} rotation={[Math.PI / 2.3, 0.2, 0]} />}
    </group>
  )
}
