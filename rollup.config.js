import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

const codePipeline = [
  copy({ targets: [{ src: 'public/**/*', dest: 'output' }] }), // it happens twice, so what?
  resolve(), // tells Rollup how to find date-fns in node_modules
  commonjs(), // converts date-fns to ES modules
  typescript(), // compiles typescript
  production && terser(), // minify, but only in production
]

export default [
  {
    input: 'src/nBodyWorker.ts',
    output: { file: 'output/nBodyWorker.js', sourcemap: true },
    plugins: codePipeline,
  },
  {
    input: 'src/index.ts',
    output: { dir: 'output', sourcemap: true },
    plugins: codePipeline,
  },
]
