import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'
import { createAtmosphereMaterial, createCloudMaterial, createHazeMaterial, createPlanetMaterial } from './materials'

export type PlanetLook = {
  ocean: string
  land: string
  high: string
  atmosphere: string
  lights?: string
  oceanLevel?: number
  ice?: number
}

type Props = ThreeElements['group'] & {
  radius: number
  look: PlanetLook
  seed?: number
  spin?: number
  detail?: number
}

/** Procedural planet with surface, drifting clouds, limb haze and an atmosphere shell. Colours ease between looks. */
export function Planet({ radius, look, seed = 1, spin = 0.004, detail = 96, ...rest }: Props) {
  const body = useRef<THREE.Mesh>(null)
  const clouds = useRef<THREE.Mesh>(null)
  const invalidate = useThree((s) => s.invalidate)
  const geo = useMemo(() => new THREE.SphereGeometry(1, detail, Math.round(detail * 0.75)), [detail])
  const mats = useMemo(() => {
    const surface = createPlanetMaterial()
    surface.uniforms.uOcean.value.set(look.ocean)
    surface.uniforms.uLand.value.set(look.land)
    surface.uniforms.uHigh.value.set(look.high)
    surface.uniforms.uLights.value.set(look.lights ?? '#ffc98a')
    surface.uniforms.uOceanLevel.value = look.oceanLevel ?? 0.5
    surface.uniforms.uIce.value = look.ice ?? 0.78
    surface.uniforms.uSeed.value = seed
    const cloud = createCloudMaterial()
    cloud.uniforms.uSeed.value = seed
    return { surface, cloud, atmo: createAtmosphereMaterial(look.atmosphere), haze: createHazeMaterial(look.atmosphere) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const target = useMemo(
    () => ({
      ocean: new THREE.Color(look.ocean),
      land: new THREE.Color(look.land),
      high: new THREE.Color(look.high),
      lights: new THREE.Color(look.lights ?? '#ffc98a'),
      atmo: new THREE.Color(look.atmosphere),
      oceanLevel: look.oceanLevel ?? 0.5,
      ice: look.ice ?? 0.78,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    target.ocean.set(look.ocean)
    target.land.set(look.land)
    target.high.set(look.high)
    target.lights.set(look.lights ?? '#ffc98a')
    target.atmo.set(look.atmosphere)
    target.oceanLevel = look.oceanLevel ?? 0.5
    target.ice = look.ice ?? 0.78
    mats.surface.uniforms.uSeed.value = seed
    mats.cloud.uniforms.uSeed.value = seed
    invalidate()
  }, [look, seed, target, mats, invalidate])

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 1.8)
    const u = mats.surface.uniforms
    u.uOcean.value.lerp(target.ocean, k)
    u.uLand.value.lerp(target.land, k)
    u.uHigh.value.lerp(target.high, k)
    u.uLights.value.lerp(target.lights, k)
    u.uOceanLevel.value += (target.oceanLevel - u.uOceanLevel.value) * k
    u.uIce.value += (target.ice - u.uIce.value) * k
    mats.atmo.uniforms.uColor.value.lerp(target.atmo, k)
    mats.haze.uniforms.uColor.value.lerp(target.atmo, k)
    if (body.current) body.current.rotation.y += dt * spin
    if (clouds.current) clouds.current.rotation.y += dt * spin * 1.25
  })

  return (
    <group {...rest} scale={radius}>
      <mesh ref={body} geometry={geo} material={mats.surface} />
      <mesh geometry={geo} material={mats.haze} scale={1.002} />
      <mesh ref={clouds} geometry={geo} material={mats.cloud} scale={1.012} />
      <mesh geometry={geo} material={mats.atmo} scale={1.06} />
    </group>
  )
}
