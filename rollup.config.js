import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'
import execute from 'rollup-plugin-execute'

const production = !process.env.ROLLUP_WATCH

const buildAsc = 'asc assembly/nBodyWasm.ts --target production --bindings raw --outFile output/nBodyWasm.wasm'
const wasmAndStaticPlugins = [
  execute(buildAsc, true),
  copy({ targets: [{ src: 'static/*', dest: 'output', flatten: false }] }),
]
const typeScriptPlugins = [
  resolve(), // tells Rollup how to find date-fns in node_modules
  commonjs(), // converts date-fns to ES modules
  typescript(), // compiles typescript
  production && terser(), // minify, but only in production
]

export default [
  {
    input: 'src/nBodyWorker.ts',
    output: { file: 'output/nBodyWorker.js', sourcemap: true },
    plugins: wasmAndStaticPlugins.concat(typeScriptPlugins),
  },
  {
    input: 'src/index.ts',
    output: { dir: 'output', sourcemap: true },
    plugins: typeScriptPlugins,
  },
]
