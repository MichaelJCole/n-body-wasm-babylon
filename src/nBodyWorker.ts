/**
 * The assemblyscript loader.  It adds helpers for moving data to/from AssemblyScript.  Highly recommended
 */
import { instantiate, __AdaptedExports } from '../output/nBodyWasm.js'

let nBodyInstance: typeof __AdaptedExports | undefined
/**
 * Web Workers listen for messages from the main thread.  This is the entire API surface area
 */
onmessage = async function (evt) {
  // message from UI thread
  var msg = evt.data
  switch (msg.purpose) {
    // Message: instantiate the compiled wasm module

    case 'wasmModule':
      // Instantiate the compiled module we were passed.
      // The msg.wasmModule was fetch()ed in the DOM thread because web workers can't fetch()
      nBodyInstance = await instantiate(msg.wasmModule, { env: {} }) // Throws

      // create planets in wasm module
      nBodyInstance.init()

      // Tell nBodySimulation.js we are ready
      this.postMessage({ purpose: 'wasmReady' })
      return

    // Message: step() move forward in time

    case 'step':
      if (!nBodyInstance) throw new Error('nBodyInstance not initialized')

      const locations = nBodyInstance.step()
      // Message results back to main thread.  see nBodySimulation.js this.worker.onmessage
      return this.postMessage({
        purpose: 'step',
        locations,
      })
  }
}
