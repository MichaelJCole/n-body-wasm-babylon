import { Imports } from '../node_modules/@assemblyscript/loader/index'

/** Exported memory */
declare const memory: WebAssembly.Memory
/** assembly/nBodyWasm/FLOAT64ARRAY_ID */
declare const FLOAT64ARRAY_ID: {
  /** @type `u32` */
  get value(): number
}
/** assembly/nBodyWasm/G */
declare const G: {
  /** @type `f64` */
  get value(): number
}
/** assembly/nBodyWasm/bodySize */
declare const bodySize: {
  /** @type `i32` */
  get value(): number
}
/** assembly/nBodyWasm/forceSize */
declare const forceSize: {
  /** @type `i32` */
  get value(): number
}
/**
 * assembly/nBodyWasm/nBodyForces
 * @param arrBodies `~lib/typedarray/Float64Array`
 * @returns `~lib/typedarray/Float64Array`
 */
declare function nBodyForces(arrBodies: Float64Array): Float64Array

export declare type nBodyExports = {
  memory
  FLOAT64ARRAY_ID
  G
  bodySize
  forceSize
  nBodyForces
}

export declare function instantiate(module: WebAssembly.Module, imports: Imports): Promise<nBodyExports>
