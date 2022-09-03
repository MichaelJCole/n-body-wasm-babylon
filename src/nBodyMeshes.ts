import { GLTFFileLoader } from '@babylonjs/loaders'
import { SceneLoader } from '@babylonjs/core'
import { Scene } from '@babylonjs/core/scene'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'

const FILE_PATH = '/models/'

const loader = new GLTFFileLoader()

export type MeshLoadingRecord = {
  name: string
  mesh: AbstractMesh
}
export type MeshLib = Record<string, AbstractMesh>

export class MeshLoader {
  initialized: Promise<MeshLib>
  meshLib: MeshLib = {}
  constructor(scene: Scene) {
    this.initialized = Promise.all([
      /*load meshes*/
      loadPlanetFile(scene, 'Sun.glb', ['Sun']),
      loadPlanetFile(scene, 'Jupiter.glb', ['Jupiter']),
      loadPlanetFile(scene, 'Saturn.glb', ['Saturn']),
      loadPlanetFile(scene, 'Uranus.glb', ['Uranus']),
      loadPlanetFile(scene, 'Neptune.glb', ['Neptune']),
      loadPlanetFile(scene, 'Moon.glb', ['Moon']),
    ]).then((meshLoadingRecordss: MeshLoadingRecord[][]): MeshLib => {
      // Then create the meshLib we'll use to access them
      const allRecs = meshLoadingRecordss.reduce((total, meshLoadingRecords) => {
        return total.concat(meshLoadingRecords)
      }, [])
      return allRecs.reduce<MeshLib>((meshLib, rec) => {
        meshLib[rec.name] = rec.mesh
        return meshLib
      }, {})
    })
  }
}

async function loadPlanetFile(scene: Scene, fileName: string, meshNames: string[]): Promise<MeshLoadingRecord[]> {
  // Load the file and await
  const results = await SceneLoader.ImportMeshAsync('', FILE_PATH, fileName, scene) // __root__ mesh
  return meshNames.map((meshName: string) => {
    return { name: meshName, mesh: results.meshes[0] }
  })
}
