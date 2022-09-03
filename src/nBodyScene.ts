import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { Engine } from '@babylonjs/core/Engines/engine'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import { Observable } from '@babylonjs/core/Misc/observable'
import { Scene } from '@babylonjs/core/scene'

import { MeshLoader } from './nBodyMeshes'
import { FLOATS_PER_BODY } from '../assembly/nBodyConfig'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'

const POSITION_SCALE = 0.00000000001
const SIZE_SCALE = 1

/**
 * Connects the simulation code to the mesh.
 */
class Body {
  rotationAxis = new Vector3(0, 0, 1)
  constructor(public mesh: AbstractMesh) {}
  drawSize = 0

  draw(x: number, y: number, z: number, mass: number) {
    this.mesh.position.x = x * POSITION_SCALE
    this.mesh.position.y = y * POSITION_SCALE
    this.mesh.position.z = z * POSITION_SCALE
    if (!this.drawSize) this.drawSize = Math.min(Math.max(Math.log10(mass), 1), 10) // 1-10 log ten
    this.mesh.scaling.x = this.mesh.scaling.y = this.mesh.scaling.z = this.drawSize * SIZE_SCALE
  }
}

function createSkySphere(scene: Scene) {
  // Add 360 video - https://doc.babylonjs.com/divingDeeper/environment/360VideoDome
  // Add campfire sound
}

export async function createScene(
  canvas: HTMLCanvasElement,
  locationsObservable: Observable<Float64Array>,
): Promise<Scene> {
  const engine = new Engine(canvas)

  // Start Loading screen

  // Create our first scene.
  var scene = new Scene(engine)
  const meshLib = new MeshLoader(scene)
  const meshes = await meshLib.initialized // promise to load meshes

  // Montana campfire at night
  createSkySphere(scene)

  // Stop Loading screen

  //const ground = MeshBuilder.CreateGround('ground', { width: BOUNDS, height: BOUNDS, subdivisions: 100 }, scene)

  // This creates and positions a free camera (non-mesh)
  var camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)
  camera.setTarget(Vector3.Zero())
  camera.attachControl(canvas, true)
  camera.parent = meshes['Sun']

  const shittyLight = new HemisphericLight('HemiLight', new Vector3(0, 1, 0), scene)

  // These are indexed in the scene and get different meshes
  // 0=Sun, Jupiter, Saturn, Uranus, Neptune
  // The other planets don't matter so much, so they all get the Moon mesh
  const bodies: Body[] = [
    new Body(meshes['Sun']),
    new Body(meshes['Jupiter']),
    new Body(meshes['Saturn']),
    new Body(meshes['Neptune']),
    new Body(meshes['Uranus']),
  ]
  // This is the initial set of known objects.
  // We'll throw alot of smaller objects into the mix

  locationsObservable.add((locations: Float64Array) => {
    // For each object, upsert to bodies and draw()
    for (let i = 0; i < locations.length; i += FLOATS_PER_BODY) {
      if (i >= bodies.length) bodies[i] = new Body(meshes['Moon'])

      bodies[locations[i]].draw(
        locations[i + 1], // x
        locations[i + 2], // y
        locations[i + 3], // z
        locations[i + 4], // mass
      )
    }
  })

  // Render every frame
  engine.runRenderLoop(() => {
    scene.render()
  })

  return scene
}
