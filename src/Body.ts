import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import { POSITION_SCALE, SIZE_SCALE } from './config'

/**
 * Connects the simulation code to the mesh.
 */
export class Body {
  constructor(public id: number, public mesh: AbstractMesh) {}
  drawSize = 0
  draw(x: number, y: number, z: number, mass: number) {
    this.mesh.position.x = x * POSITION_SCALE
    this.mesh.position.y = y * POSITION_SCALE
    this.mesh.position.z = z * POSITION_SCALE
    if (!this.drawSize) this.drawSize = Math.min(Math.max(Math.log10(mass * SIZE_SCALE), 1), 10) // 1-10 log ten
    this.mesh.scaling.x = this.mesh.scaling.y = this.mesh.scaling.z = this.drawSize
  }
}
