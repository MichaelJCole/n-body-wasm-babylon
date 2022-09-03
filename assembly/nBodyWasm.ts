// Original: https://github.com/AssemblyScript/examples/blob/main/n-body/assembly/index.ts
// License:  https://github.com/AssemblyScript/examples/blob/main/LICENSE
// From The Computer Language Benchmarks Game http://benchmarksgame.alioth.debian.org

type float = f64 // interchangeable f32/f64 for testing

import { SOLAR_MASS, DAYS_PER_YEAR, BOUNDS, SIM_SPEED, FLOATS_PER_BODY } from './nBodyConfig'

let bodyIndex = 0

const startMs = Date.now()

class Body {
  id: number = bodyIndex++
  constructor(
    public x: float,
    public y: float,
    public z: float,
    public vx: float,
    public vy: float,
    public vz: float,
    public mass: float,
  ) {}

  offsetMomentum(px: float, py: float, pz: float): this {
    this.vx = -px / SOLAR_MASS
    this.vy = -py / SOLAR_MASS
    this.vz = -pz / SOLAR_MASS
    return this
  }
}

function Sun(): Body {
  return new Body(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, SOLAR_MASS)
}

function Jupiter(): Body {
  return new Body(
    4.8414314424647209,
    -1.16032004402742839,
    -1.03622044471123109e-1,
    1.66007664274403694e-3 * DAYS_PER_YEAR,
    7.69901118419740425e-3 * DAYS_PER_YEAR,
    -6.90460016972063023e-5 * DAYS_PER_YEAR,
    9.54791938424326609e-4 * SOLAR_MASS,
  )
}

function Saturn(): Body {
  return new Body(
    8.34336671824457987,
    4.12479856412430479,
    -4.03523417114321381e-1,
    -2.76742510726862411e-3 * DAYS_PER_YEAR,
    4.99852801234917238e-3 * DAYS_PER_YEAR,
    2.30417297573763929e-5 * DAYS_PER_YEAR,
    2.85885980666130812e-4 * SOLAR_MASS,
  )
}

function Uranus(): Body {
  return new Body(
    1.2894369562139131e1,
    -1.51111514016986312e1,
    -2.23307578892655734e-1,
    2.96460137564761618e-3 * DAYS_PER_YEAR,
    2.3784717395948095e-3 * DAYS_PER_YEAR,
    -2.96589568540237556e-5 * DAYS_PER_YEAR,
    4.36624404335156298e-5 * SOLAR_MASS,
  )
}

function Neptune(): Body {
  return new Body(
    1.53796971148509165e1,
    -2.59193146099879641e1,
    1.79258772950371181e-1,
    2.68067772490389322e-3 * DAYS_PER_YEAR,
    1.62824170038242295e-3 * DAYS_PER_YEAR,
    -9.5159225451971587e-5 * DAYS_PER_YEAR,
    5.15138902046611451e-5 * SOLAR_MASS,
  )
}

class NBodySystem {
  constructor(public bodies: Array<Body>) {
    var px: float = 0.0
    var py: float = 0.0
    var pz: float = 0.0
    for (let i = 0; i < bodies.length; ++i) {
      let b = unchecked(bodies[i])
      let m = b.mass
      px += b.vx * m
      py += b.vy * m
      pz += b.vz * m
    }
    //unchecked(bodies[0]).offsetMomentum(px, py, pz)
  }

  advance(dt: float): void {
    var bodies = this.bodies
    var size: u32 = bodies.length
    // var buffer = changetype<usize>(bodies.buffer_);

    // Calculate and apply forces
    for (let i: u32 = 0; i < size; ++i) {
      let bodyi = unchecked(bodies[i])
      // let bodyi = load<Body>(buffer + i * sizeof<Body>(), 8);

      let ix = bodyi.x
      let iy = bodyi.y
      let iz = bodyi.z

      let bivx = bodyi.vx
      let bivy = bodyi.vy
      let bivz = bodyi.vz

      let bodyim = bodyi.mass
      for (let j: u32 = i + 1; j < size; ++j) {
        let bodyj = unchecked(bodies[j])
        // let bodyj = load<Body>(buffer + j * sizeof<Body>(), 8);

        let dx = ix - bodyj.x
        let dy = iy - bodyj.y
        let dz = iz - bodyj.z

        let distanceSq = dx * dx + dy * dy + dz * dz
        let distance = <float>Math.sqrt(distanceSq)
        let mag = dt / (distanceSq * distance)

        let bim = bodyim * mag
        let bjm = bodyj.mass * mag

        bivx -= dx * bjm
        bivy -= dy * bjm
        bivz -= dz * bjm

        bodyj.vx += dx * bim
        bodyj.vy += dy * bim
        bodyj.vz += dz * bim
      }

      bodyi.vx = bivx
      bodyi.vy = bivy
      bodyi.vz = bivz

      bodyi.x += dt * bivx
      bodyi.y += dt * bivy
      bodyi.z += dt * bivz
    }
    /*
    // Remove any objects out of bounds
    let i = bodies.length
    while (i--) {
      if (
        bodies[i].x < -BOUNDS ||
        bodies[i].x > BOUNDS ||
        bodies[i].y < -BOUNDS ||
        bodies[i].y > BOUNDS ||
        bodies[i].z < -BOUNDS ||
        bodies[i].z > BOUNDS
      )
        this.bodies.splice(i, 1)
    }
    */
  }
}

var system: NBodySystem

export function init(): void {
  system = new NBodySystem([Sun(), Jupiter(), Saturn(), Uranus(), Neptune()])
}

export function add(x: float, y: float, z: float, vx: float, vy: float, vz: float, mass: float): number {
  system.bodies.push(new Body(x, y, z, vx, vy, vz, mass))
  return system.bodies.length
}

// Return a Float64 array with id,x,y,z of all objects
export function step(): Float64Array {
  const simulatedMs = Date.now() - startMs
  const simulatedSteps = simulatedMs / 33 // tick every 33 ms
  system.advance(<f64>simulatedSteps * SIM_SPEED)
  const ret = new Float64Array(system.bodies.length * FLOATS_PER_BODY)
  // Iterate the bodies and fill out the array
  for (let i = 0; i < system.bodies.length; i++) {
    const body = system.bodies[i]
    const j = i * FLOATS_PER_BODY
    ret[j] = body.id
    ret[j + 1] = body.x
    ret[j + 2] = body.y
    ret[j + 3] = body.z
    ret[j + 4] = body.mass
  }
  return ret
}
