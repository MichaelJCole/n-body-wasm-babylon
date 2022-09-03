import { nBodyVisBabylon } from './nBodyVisualizer'
import { nBodySimulator } from './nBodySimulator'

window.onload = function () {
  // Find the canvas
  const canvas = document.getElementById('babylon') as HTMLCanvasElement | null
  if (!canvas) return console.error('could not find canvas element')

  // Create a Simulation, pass the
  const sim = new nBodySimulator()

  // Create the babylon visualization
  const vis = new nBodyVisBabylon(canvas, sim.locationsObservable)

  // Start simulation
  sim.step()
}
