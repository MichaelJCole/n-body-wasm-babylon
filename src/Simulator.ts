import { Observable } from '@babylonjs/core'
import { SIMULATION_MS_PER_STEP, WORKER_URL, WASM_URL } from './config'
import { SolarSystem } from './SolarSystem'

/**
 * Our simulation in the main thread passes messages to/from WebWorker which calls NBodySystem
 */
export class Simulator {
  // Has the worker been setup?
  workerReady = false
  // Is the worker calculating
  workerCalculating = false

  // Web worker w/ Wasm module that does the calculating
  worker: Worker

  // Create observable that will receive updates
  locationsObservable = new Observable<Float64Array>()

  /**
   * Setup our web worker - buckle up, let's get weird.
   */
  constructor() {
    // Create a Web Worker (separate thread) that we'll pass the WebAssembly module to.
    this.worker = new Worker(WORKER_URL)

    // Console errors from WebWorker.js
    this.worker.onerror = function (evt: { message: string }) {
      console.log(`Error from Web Worker: ${evt.message}`)
    }

    // Listen for messages from WebWorker.js postMessage()
    const self = this
    this.worker.onmessage = function (evt: MessageEvent) {
      if (evt && evt.data) {
        // Messages are dispatched by purpose
        const msg = evt.data
        switch (msg.purpose) {
          // worker has loaded the wasm module we compiled and sent.  Let the magic begin!
          // See postmessage at the bottom of this function.

          case 'init':
            self.workerReady = true
            break

          // wasm has computed locations for us

          case 'step':
            self.workerCalculating = false
            if (msg.locations) self.locationsObservable.notifyObservers(msg.locations)
            if (msg.error) console.log(msg.error)
            setTimeout(self.step.bind(self), SIMULATION_MS_PER_STEP)
            break
        }
      }
    }

    const solarSystem = new SolarSystem()
    // Fetch and compile the wasm module because web workers cannot fetch()
    WebAssembly.compileStreaming(fetch(WASM_URL))
      // Send the compiled wasm module to the worker as a message
      .then((wasmModule) => {
        self.worker.postMessage({
          purpose: 'init',
          wasmModule,
          bodyFloats: solarSystem.getBodyFloats(),
        })
      })
  }

  /**
   * Is the simulation ready to calculate
   */
  ready() {
    return this.workerReady && !this.workerCalculating
  }

  /**
   * This is the simulation loop.
   */
  async step() {
    if (!this.ready()) {
      setTimeout(this.step.bind(this), SIMULATION_MS_PER_STEP)
      return console.log(`Skipping sim calcuation.  Worker is busy:${this.workerCalculating}`)
    }
    this.workerCalculating = true

    // postMessage() to worker to start calculation
    // Execution continues in WebWorker.js worker.onmessage()
    this.worker.postMessage({ purpose: 'step' })
    // setTimeout(step) happens in worker.onmessage({purpose:'step'})
  }
}
