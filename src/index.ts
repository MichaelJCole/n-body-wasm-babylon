import { nBodyVisualizer, nBodyVisBabylon } from './nBodyVisualizer'
import { Body, nBodySimulator } from './nBodySimulator'

window.onload = function () {
  // Create a Simulation
  const sim = new nBodySimulator()

  // Add some visualizers
  const canvasElement = document.getElementById('babylon')
  if (!canvasElement) return console.error('could not find canvas element')
  sim.addVisualization(new nBodyVisualizer(canvasElement))
  sim.addVisualization(new nBodyVisBabylon(canvasElement))

  // This is a simulation, using opinionated G = 6.674e-11
  // So boring values are allowed and create systems that collapse over billions of years.

  // For spinny, where distance = 1, masses of 1e10 are fun

  // Set Z coords to 1 for best visualiztion in overhead 2d Canvas, and so any clickable objects are above the plane
  // lol, making up stable universes is hard
  //                   name            color     x    y    z    m      vz    vy   vz
  sim.addBody(new Body('star', 'yellow', 0, 0, 1, 1e9, 0, 0, 0))
  sim.addBody(new Body('hot-jupiter', 'red', -1, -1, 1, 1e4, 0.24, -0.05, 0))
  sim.addBody(new Body('cold-jupiter', 'purple', 4, 4, 0.5, 1e4, -0.07, 0.04, 0))

  // Start simulation
  sim.start()

  // Add another
  sim.addBody(new Body('saturn', 'blue', -8, -8, 0.1, 1e3, 0.07, -0.035, 0))

  // That hand crafts a stable solar system.
  // Inner planets will not have enough mass to affect giant planets
  // We can now play in that system by throwing debris around (inner plants)
  // Because that debris will have significanly smaller mass, it won't disturb our stable system.  Mostly :-)
  // This requires we remove bodies that fly out of bounds.  See sim.trimDebris().
}
