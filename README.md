# n-body Tech Demo: Web Workers, WebAssembly, AssemblyScript, and BabylonJS

This is an update to a tech demo I did several years ago for a [5-part blog series on WebVR.](https://www.toptal.com/virtual-reality/webvr-design-and-implementation).

In this version, I upgraded to the new bindings auto-generated by AssemblyScript, and implemented the visualizer in Babylon.js

[Live 3d WebVR BabylonJS Demo](https://michaeljcole.github.io/n-body-wasm-babylon/)
[Live 3d WebVR A-Frame Demo](https://michaeljcole.github.io/n-body-wasm-webvr/)
[Live 2d Canvas Demo](https://michaeljcole.github.io/n-body-wasm-canvas/)

Using the Tech

- [Babylon.js](https://www.babylonjs.com/) - For visualization
- [Web Workers](https://www.html5rocks.com/en/tutorials/workers/basics/) - a separate thread to run our calculations
- [WebAssembly (Wasm)](https://webassembly.org/) - a high performance web binary that allows execution of other languages on the web (C, C++, Rust, etc)
- [AssemblyScript](https://docs.assemblyscript.org/) - a TypeScript subset that compiles to high-performance Wasm

We'll apply this tech to the [n-body problem](https://en.wikipedia.org/wiki/N-body_problem). This is an astro-physics problem famous for being numerical (solved by a program) instead of analytical (solved by equations).

Essentially we'll throw some debris in a 3d space and watch it go spinny.

Why? The n-body problem is CPU intensive.  
We will code those computations in WebAssembly (high performance C/Rust/AssemblyScript code), then run them in a separate thread.

# Running Locally

If you have Node.js >= 16 installed:

```
# Install all the dev packages
npm install

# Build the Wasm using asc and the app using rollup
npm run dev
```

# Architecture and Design

```
UI THREAD                /          WORKER THREAD

browser
  |
index.html
  |
index.ts
  |
nBodySimulator.ts-----(web worker------nBodyWorker.ts
  |                 message passing)     |
(draws to)                             nBodyWorker.ts/wasm
  |
nBodyVisualizer.ts
  |
Babylon.js
```

# Implementation

Files:

```

rollup.config.js             -  Build file

src/index.html               -  Web App
src/index.ts                 -  Entry point.
src/nBodySimulator.js        -  Simulation loop and loads a nBodyWasm implementation
src/nBodyVisualizer.js       -  Simulation visualizers
src/nBodyWorker.js           -  Web worker to calculate in separate thread

src/assembly/nBodyWasm.ts    -  AssemblyScript code to calculate forces.

src/nBoxyWasm.js             -  Two hacked autogenerated bindings.
src/nBodyWasm.d.ts           -  See https://github.com/AssemblyScript/assemblyscript/issues/2489
```
