/**
 * The assemblyscript loader.  It adds helpers for moving data to/from AssemblyScript.  Highly recommended
 */
import { instantiate, nBodyExports } from './nBodyWasm.js'

let nBodyInstance: nBodyExports | undefined

/**
 * Web Workers listen for messages from the main thread.  This is the entire API surface area
 */
onmessage = async function (evt) {
  // message from UI thread
  var msg = evt.data
  switch (msg.purpose) {
    // Message: Load new wasm module

    case 'wasmModule':
      // Instantiate the compiled module we were passed.
      // The msg.wasmModule was fetch()ed in the DOM thread because web workers can't fetch()
      nBodyInstance = await instantiate(msg.wasmModule, {}) // Throws
      // Tell nBodySimulation.js we are ready
      this.postMessage({ purpose: 'wasmReady' })
      return

    // Message: Given array of floats describing a system of bodies (x,y,x,mass),
    // calculate the Grav forces to be applied to each body

    case 'nBodyForces':
      if (!nBodyInstance) throw new Error('nBodyInstance not initialized')

      // We no longer have to allocate shared memory
      const arrForces = nBodyInstance.nBodyForces(msg.arrBodies)

      // Message results back to main thread.  see nBodySimulation.js this.worker.onmessage
      return this.postMessage({
        purpose: 'nBodyForces',
        arrForces,
      })
  }
}
