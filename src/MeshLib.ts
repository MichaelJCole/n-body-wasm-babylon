import { ErrorCodes, RuntimeError } from '@babylonjs/core/Misc'
import { SceneLoader } from '@babylonjs/core/Loading'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import { GLTFFileLoader } from '@babylonjs/loaders'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { Scene } from '@babylonjs/core/scene'

import { FILE_PATH } from './config'

const loader = new GLTFFileLoader()

export type MeshLoadingRecord = {
  name: string
  mesh: AbstractMesh
}
export type MeshMap = Record<string, Mesh>

export class MeshLib {
  initialized: Promise<MeshLib>
  meshMap: MeshMap = {}
  constructor(scene: Scene) {
    const self = this
    this.initialized = Promise.all([
      /*load meshes*/
      loadPlanetFile(scene, 'Sun.compressed.glb', 'Sun'),
      loadPlanetFile(scene, 'Mercury.compressed.glb', 'Mercury'),
      loadPlanetFile(scene, 'Venus.compressed.glb', 'Venus'),
      loadPlanetFile(scene, 'Earth.compressed.glb', 'Earth'),
      loadPlanetFile(scene, 'Mars.compressed.glb', 'Mars'),
      loadPlanetFile(scene, 'Jupiter.compressed.glb', 'Jupiter'),
      loadPlanetFile(scene, 'Saturn.compressed.glb', 'Saturn'),
      loadPlanetFile(scene, 'Uranus.compressed.glb', 'Uranus'),
      loadPlanetFile(scene, 'Neptune.compressed.glb', 'Neptune'),
      loadPlanetFile(scene, 'Moon.compressed.glb', 'Moon'),
    ]).then((meshLoadingRecordss: MeshLoadingRecord[][]): MeshLib => {
      // Then create the meshMap we'll use to access them
      const allRecs = meshLoadingRecordss.reduce((total, meshLoadingRecords) => {
        return total.concat(meshLoadingRecords)
      }, [])
      this.meshMap = allRecs.reduce<MeshMap>((meshMap, rec) => {
        meshMap[rec.name] = rec.mesh as Mesh
        return meshMap
      }, {})
      return self
    })
  }
  getInstancedMesh(meshName: string, instanceName: string | undefined = undefined): Mesh {
    if (!instanceName) instanceName = meshName + '.' + Math.floor(Math.random() * 1000)
    const mesh = this.meshMap[meshName]
    if (!mesh) throw new RuntimeError(`No mesh ${meshName} for ${instanceName}`, ErrorCodes.LoadFileError)
    const ret = mesh.clone(instanceName)
    ret.isVisible = true
    return ret
  }
}

async function loadPlanetFile(scene: Scene, fileName: string, name: string): Promise<MeshLoadingRecord[]> {
  // Load the file and await
  const results = await SceneLoader.ImportMeshAsync('', FILE_PATH, fileName, scene) // __root__ mesh
  const ret = new Array<MeshLoadingRecord>()
  results.meshes.forEach((mesh: AbstractMesh) => {
    mesh.isVisible = false
    ret.push({ name, mesh })
  })
  return ret
}
