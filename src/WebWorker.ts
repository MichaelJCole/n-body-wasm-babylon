/**
 * The assemblyscript loader.  It adds helpers for moving data to/from AssemblyScript.  Highly recommended
 */
import { instantiate, __AdaptedExports } from '../output/NBodySystem.js'

const DEBUG_IN_OUT = false

let nBodySystem: typeof __AdaptedExports | undefined
/**
 * Web Workers listen for messages from the main thread.  This is the entire API surface area
 */
onmessage = async function (evt) {
  // message from UI thread
  var msg = evt.data
  switch (msg.purpose) {
    // Message: instantiate the compiled wasm module

    case 'init':
      // Instantiate the compiled module we were passed.
      // The msg.wasmModule was fetch()ed in the DOM thread because web workers can't fetch()
      nBodySystem = await instantiate(msg.wasmModule, { env: {} }) // Throws

      // Set initial configuration
      if (DEBUG_IN_OUT) console.log('floats in: ', JSON.stringify(msg.bodyFloats))
      nBodySystem.initialize(msg.bodyFloats)

      // Tell Simulation.js we are ready
      this.postMessage({ purpose: 'init' })
      return

    // Message: step() move forward in time

    case 'step':
      if (!nBodySystem) throw new Error('nBodySystem not initialized')

      const locations = nBodySystem.step()
      if (DEBUG_IN_OUT) console.log('floats out:', locations)
      // Message results back to main thread.  see Simulation.js this.worker.onmessage
      return this.postMessage({
        purpose: 'step',
        locations,
      })
  }
}
