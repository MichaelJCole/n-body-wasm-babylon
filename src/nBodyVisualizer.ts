/**
 * This is a toolkit of visualizers for our simulation.
 */

import { Observable } from '@babylonjs/core/Misc/observable'
import { Scene } from '@babylonjs/core/scene'
import { createScene } from './nBodyScene'

/**
 * This is the WebVR visualizer.  It's responsible for painting and setting up the entire scene.
 */
export class nBodyVisBabylon {
  sceneP: Promise<Scene>
  constructor(canvas: HTMLCanvasElement, public locationsObservable: Observable<Float64Array>) {
    // Pass ovservable to scene
    this.sceneP = createScene(canvas, this.locationsObservable)

    // Canvas resizing
    const resize = this.resize.bind(this)
    addEventListener('resize', resize)
  }

  async resize() {
    const scene = await this.sceneP
    scene.getEngine().resize()
  }
}
