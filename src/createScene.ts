import { Engine } from '@babylonjs/core/Engines/engine'
import { FlyCamera } from '@babylonjs/core/Cameras/flyCamera'
import { GlowLayer } from '@babylonjs/core/Layers'
import { Observable } from '@babylonjs/core/Misc/observable'
import { PointLight } from '@babylonjs/core/Lights/pointLight'
import { Scene } from '@babylonjs/core/scene'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { VideoDome } from '@babylonjs/core/Helpers'

//import '@babylonjs/core/Debug/debugLayer'
//import '@babylonjs/inspector'

import { MeshLib } from './MeshLib'
import { FLOATS_PER_BODY_OUT } from './config'

import { Body } from './Body'

const DOME_VIDEO_URL = 'https://yoda.blob.core.windows.net/videos/uptale360.mp4'
const DOME_POSTER_URL = '/campfire.png'
const CAMERA_DIST = 100
const SUNLIGHT_INTENSITY = 2700

function createSkySphere(scene: Scene) {
  // Add 360 video - https://doc.babylonjs.com/divingDeeper/environment/360VideoDome

  // Video dome
  const dome = new VideoDome(
    'videoDome',
    DOME_VIDEO_URL,
    {
      autoPlay: true,
      clickToPlay: true,
      poster: DOME_POSTER_URL,
      useDirectMapping: false, // enables zooming
    },
    scene,
  )
  // Add campfire sound here
}

export async function createScene(
  canvas: HTMLCanvasElement,
  locationsObservable: Observable<Float64Array>,
): Promise<Scene> {
  const engine = new Engine(canvas)

  // Start Loading screen

  // Create our first scene.
  var scene = new Scene(engine)
  const meshLib = new MeshLib(scene)
  await meshLib.initialized // promise to load meshes

  // Montana campfire at night
  createSkySphere(scene)

  // Stop Loading screen

  const sunLight = new PointLight('SunLight', new Vector3(0, 1, 0), scene)
  sunLight.intensity = SUNLIGHT_INTENSITY
  const glowLayer = new GlowLayer('glow', scene)
  // These are indexed in the scene and get different meshes
  // 0=Sun, Jupiter, Saturn, Uranus, Neptune
  // The other planets don't matter so much, so they all get the Moon mesh
  const bodies: Body[] = [
    new Body(0, meshLib.getInstancedMesh('Sun', 'Sun-0')),
    new Body(1, meshLib.getInstancedMesh('Mercury', 'Mercury-0')),
    new Body(2, meshLib.getInstancedMesh('Venus', 'Venus-0')),
    new Body(3, meshLib.getInstancedMesh('Earth', 'Earth-0')),
    new Body(4, meshLib.getInstancedMesh('Mars', 'Mars-0')),
    new Body(5, meshLib.getInstancedMesh('Jupiter', 'Jupiter-0')),
    new Body(6, meshLib.getInstancedMesh('Saturn', 'Saturn-0')),
    new Body(7, meshLib.getInstancedMesh('Uranus', 'Uranus-0')),
    new Body(8, meshLib.getInstancedMesh('Neptune', 'Neptune-0')),
    new Body(9, meshLib.getInstancedMesh('Moon', 'Chiron-0')),
  ]
  const orrery = new TransformNode('orrery', scene)
  bodies.forEach((body) => {
    body.mesh.parent = orrery
    body.mesh.rotationQuaternion = null // turn off quaternions
    body.mesh.rotation.x = Math.PI / 2
  })
  orrery.rotation.x = Math.PI / 2
  orrery.position.y -= CAMERA_DIST / 4

  const camera = new FlyCamera('FlyCamera', new Vector3(CAMERA_DIST, 0, 0), scene)
  camera.setTarget(Vector3.Zero())
  camera.attachControl()

  // This is the initial set of known objects.
  // We'll throw alot of smaller objects into the mix

  locationsObservable.add((locations: Float64Array) => {
    // For each object, upsert to bodies and draw()
    for (let i = 0; i < locations.length; i += FLOATS_PER_BODY_OUT) {
      const id = locations[i]
      const x = locations[i + 1]
      const y = locations[i + 2]
      const z = locations[i + 3]
      const mass = locations[i + 4]

      let body = bodies.find((body) => body.id == id)
      if (!body) {
        body = new Body(id, meshLib.getInstancedMesh('Moon', 'moon-' + id))
        bodies.push(body)
        console.log('added New Moon mesh', body)
      }
      body.draw(x, y, z, mass)
    }
  })

  let sunDrawSize = 0
  // Render every frame
  engine.runRenderLoop(() => {
    if (!sunDrawSize) sunDrawSize = bodies[0].drawSize
    const cameraDistance = bodies[0].mesh.position.subtract(camera.position).length()
    let sunScaledDrawSize = sunDrawSize * (cameraDistance / 100)
    bodies[0].drawSize = Math.min(Math.max(sunScaledDrawSize, 1), sunDrawSize)
    scene.render()
  })

  // Show inspector.
  /*
    scene.debugLayer.show({
      embedMode: true,
    })
  */
  return scene
}
