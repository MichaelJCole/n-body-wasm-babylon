import { VisualizerBabylon } from './Visualizer'
import { Simulator } from './Simulator'

window.onload = function () {
  // Find the canvas
  const canvas = document.getElementById('babylon') as HTMLCanvasElement | null
  if (!canvas) return console.error('could not find canvas element')

  // Create a Simulation, pass the
  const sim = new Simulator()

  // Create the babylon visualization
  const vis = new VisualizerBabylon(canvas, sim.locationsObservable)

  // Start simulation
  sim.step()
}
