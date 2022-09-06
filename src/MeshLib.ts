import { Scene, AbstractMesh, ErrorCodes, InstancedMesh, Mesh, RuntimeError, SceneLoader } from '@babylonjs/core'
import { GLTFFileLoader } from '@babylonjs/loaders'
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
      loadPlanetFile(scene, 'Sun.glb', 'Sun'),
      loadPlanetFile(scene, 'Mercury.glb', 'Mercury'),
      loadPlanetFile(scene, 'Venus.glb', 'Venus'),
      loadPlanetFile(scene, 'Earth.glb', 'Earth'),
      loadPlanetFile(scene, 'Mars.glb', 'Mars'),
      loadPlanetFile(scene, 'Jupiter.glb', 'Jupiter'),
      loadPlanetFile(scene, 'Saturn.glb', 'Saturn'),
      loadPlanetFile(scene, 'Uranus.glb', 'Uranus'),
      loadPlanetFile(scene, 'Neptune.glb', 'Neptune'),
      loadPlanetFile(scene, 'Moon.glb', 'Moon'),
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
  getInstancedMesh(meshName: string, instanceName: string | undefined = undefined): InstancedMesh {
    if (!instanceName) instanceName = meshName + '.' + Math.floor(Math.random() * 1000)
    const mesh = this.meshMap[meshName]
    if (!mesh) {
      console.log('getInstancedMesh', meshName, instanceName, this.meshMap)
      throw new RuntimeError(`No mesh ${meshName} for ${instanceName}`, ErrorCodes.LoadFileError)
    }
    return mesh.createInstance(instanceName)
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
