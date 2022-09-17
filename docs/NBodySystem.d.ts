declare namespace __AdaptedExports {
  /** Exported memory */
  export const memory: WebAssembly.Memory;
  /**
   * assembly/NBodySystem/add
   * @param x `f64`
   * @param y `f64`
   * @param z `f64`
   * @param vx `f64`
   * @param vy `f64`
   * @param vz `f64`
   * @param mass `f64`
   * @returns `f64`
   */
  export function add(x: number, y: number, z: number, vx: number, vy: number, vz: number, mass: number): number;
  /**
   * assembly/NBodySystem/step
   * @returns `~lib/typedarray/Float64Array`
   */
  export function step(): Float64Array;
  /**
   * assembly/NBodySystem/initialize
   * @param bodyFloats `~lib/typedarray/Float64Array`
   * @returns `f64`
   */
  export function initialize(bodyFloats: Float64Array): number;
}
/** Instantiates the compiled WebAssembly module with the given imports. */
export declare function instantiate(module: WebAssembly.Module, imports: {
  env: unknown,
}): Promise<typeof __AdaptedExports>;
