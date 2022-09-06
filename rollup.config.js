import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'
// import execute from 'rollup-plugin-execute'

const production = !process.env.ROLLUP_WATCH

//const buildAsc = 'asc assembly/NBodySystem.ts --target debug --bindings raw --outFile output/NBodySystem.wasm'
const wasmAndStaticPlugins = [
  //execute(buildAsc, true),
  copy({ targets: [{ src: 'static/*', dest: 'output', flatten: false }], copyOnce: true }),
]
const typeScriptPlugins = [
  resolve(), // tells Rollup how to find date-fns in node_modules
  commonjs(), // converts date-fns to ES modules
  typescript(), // compiles typescript
  production && terser(), // minify, but only in production
]

export default [
  {
    input: 'src/WebWorker.ts',
    output: { file: 'output/WebWorker.js', sourcemap: true },
    plugins: wasmAndStaticPlugins.concat(typeScriptPlugins),
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'output',
      sourcemap: true,
      // manualChunks: { babylon: ['@babylonjs/core', '@babylonjs/inspector'], },
    },
    plugins: typeScriptPlugins,
  },
]
