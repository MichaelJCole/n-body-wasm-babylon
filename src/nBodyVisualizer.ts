/**
 * This is a toolkit of visualizers for our simulation.
 */

import { Body } from './nBodySimulator'

/**
 * Base class that console.log()s the simulation state.
 */
export class nBodyVisualizer {
  htmlElement: HTMLElement
  scaleSize: number
  nextId: number = 0
  constructor(htmlElement: HTMLElement) {
    this.htmlElement = htmlElement
    this.resize()

    this.scaleSize = 25 // divided into bodies drawSize.  drawSize is log10(mass)
  }

  resize() {}

  paint(bodies: Body[]) {
    console.log(JSON.stringify(bodies, null, 2))
  }
}

/**
 * Pretty print simulation to an htmlElement's innerHTML
 */
export class nBodyVisPrettyPrint extends nBodyVisualizer {
  constructor(htmlElement: HTMLElement) {
    super(htmlElement)
  }

  resize() {}

  paint(bodies: Body[]) {
    let text = ''
    bodies.forEach((body) => {
      text += `<br>${body.name} {<br>  x:${body.x.toPrecision(2)}<br>  y:${body.y.toPrecision(
        2,
      )}<br>  z:${body.z.toPrecision(2)}<br>  mass:${body.mass.toPrecision(2)})<br>}<br>${body.drawSize}`
    })
    if (this.htmlElement) this.htmlElement.innerHTML = text
  }
}

/**
 * This is the WebVR visualizer.  It's responsible for painting and setting up the entire scene.
 */
export class nBodyVisBabylon extends nBodyVisualizer {
  constructor(htmlElement: HTMLElement) {
    super(htmlElement)
  }

  resize() {}

  paint(bodies: Body[]) {
    // Create lookup table:  lookup[body.aframeId] = body
    // If new body, give it an aframeId
    // Loop through existing a-sim-bodies and remove any that are not in lookup - dropped debris
    // if we don't find the scene's a-body in the lookup table of Body()s,
    // loop through sim bodies and upsert
    // Find the html element for this aframeId
    // If html element not found, make one.
    // reposition
  }
}

// Unused reference implementations below
