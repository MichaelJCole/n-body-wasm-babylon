import { BOUNDS, SIM_SPEED, FLOATS_PER_BODY_OUT, FLOATS_PER_BODY_IN } from './config'
type float = f64

class NBodySystem {
  public bodies: Body[]

  constructor() {
    this.bodies = [Body.Sun(), Body.Jupiter(), Body.Saturn(), Body.Uranus(), Body.Neptune()]
    this.offsetMomentum() // push sun so that origin will stay around 0
  }

  advance(dt: float): void {
    let dx: float, dy: float, dz: float, distance: float, mag: float
    let size = this.bodies.length

    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        dx = this.bodies[i].x - this.bodies[j].x
        dy = this.bodies[i].y - this.bodies[j].y
        dz = this.bodies[i].z - this.bodies[j].z

        distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
        mag = dt / (distance * distance * distance)

        this.bodies[i].vx -= dx * this.bodies[j].mass * mag
        this.bodies[i].vy -= dy * this.bodies[j].mass * mag
        this.bodies[i].vz -= dz * this.bodies[j].mass * mag

        this.bodies[j].vx += dx * this.bodies[i].mass * mag
        this.bodies[j].vy += dy * this.bodies[i].mass * mag
        this.bodies[j].vz += dz * this.bodies[i].mass * mag
      }
    }

    for (let i = 0; i < size; i++) {
      let body = this.bodies[i]
      body.x += dt * body.vx
      body.y += dt * body.vy
      body.z += dt * body.vz
    }
  }

  energy(): float {
    let dx: float, dy: float, dz: float, distance: float
    let e = 0.0
    let size = this.bodies.length

    for (let i = 0; i < size; i++) {
      e +=
        0.5 *
        this.bodies[i].mass *
        (this.bodies[i].vx * this.bodies[i].vx +
          this.bodies[i].vy * this.bodies[i].vy +
          this.bodies[i].vz * this.bodies[i].vz)

      for (let j = i + 1; j < size; j++) {
        dx = this.bodies[i].x - this.bodies[j].x
        dy = this.bodies[i].y - this.bodies[j].y
        dz = this.bodies[i].z - this.bodies[j].z

        distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
        e -= (this.bodies[i].mass * this.bodies[j].mass) / distance
      }
    }
    return e
  }

  offsetMomentum(): void {
    let px = 0.0
    let py = 0.0
    let pz = 0.0

    let size = this.bodies.length
    for (let i = 0; i < size; i++) {
      let b = this.bodies[i]
      let m = b.mass
      px += b.vx * m
      py += b.vy * m
      pz += b.vz * m
    }
    this.bodies[0].offsetMomentum(px, py, pz)
  }
}

let bodyCount = 0

class Body {
  id: number = bodyCount++
  static PI: float = 3.141592653589793
  static SOLAR_MASS: float = 4 * Body.PI * Body.PI
  static DAYS_PER_YEAR: float = 365.24

  constructor(
    public x: float,
    public y: float,
    public z: float,
    public vx: float,
    public vy: float,
    public vz: float,
    public mass: float,
  ) {}

  static Sun(): Body {
    return new Body(0, 0, 0, 0, 0, 0, Body.SOLAR_MASS)
  }

  static Jupiter(): Body {
    return new Body(
      4.8414314424647209,
      -1.16032004402742839,
      -1.03622044471123109e-1,
      1.66007664274403694e-3 * Body.DAYS_PER_YEAR,
      7.69901118419740425e-3 * Body.DAYS_PER_YEAR,
      -6.90460016972063023e-5 * Body.DAYS_PER_YEAR,
      9.54791938424326609e-4 * Body.SOLAR_MASS,
    )
  }

  static Saturn(): Body {
    return new Body(
      8.34336671824457987,
      4.12479856412430479,
      -4.03523417114321381e-1,
      -2.76742510726862411e-3 * Body.DAYS_PER_YEAR,
      4.99852801234917238e-3 * Body.DAYS_PER_YEAR,
      2.30417297573763929e-5 * Body.DAYS_PER_YEAR,
      2.85885980666130812e-4 * Body.SOLAR_MASS,
    )
  }

  static Uranus(): Body {
    return new Body(
      1.2894369562139131e1,
      -1.51111514016986312e1,
      -2.23307578892655734e-1,
      2.96460137564761618e-3 * Body.DAYS_PER_YEAR,
      2.3784717395948095e-3 * Body.DAYS_PER_YEAR,
      -2.96589568540237556e-5 * Body.DAYS_PER_YEAR,
      4.36624404335156298e-5 * Body.SOLAR_MASS,
    )
  }

  static Neptune(): Body {
    return new Body(
      1.53796971148509165e1,
      -2.59193146099879641e1,
      1.79258772950371181e-1,
      2.68067772490389322e-3 * Body.DAYS_PER_YEAR,
      1.62824170038242295e-3 * Body.DAYS_PER_YEAR,
      -9.5159225451971587e-5 * Body.DAYS_PER_YEAR,
      5.15138902046611451e-5 * Body.SOLAR_MASS,
    )
  }

  offsetMomentum(px: float, py: float, pz: float): Body {
    this.vx = -px / Body.SOLAR_MASS
    this.vy = -py / Body.SOLAR_MASS
    this.vz = -pz / Body.SOLAR_MASS
    return this
  }
}

// ----  Export as WebAssembly functions
const system: NBodySystem = new NBodySystem()

export function add(x: float, y: float, z: float, vx: float, vy: float, vz: float, mass: float): float {
  console.log(`new Body: ${x} ${y} ${z} ${vx} ${vy} ${vz} ${mass} `)
  system.bodies.push(new Body(x, y, z, vx, vy, vz, mass))
  return system.bodies.length
}

// Return a Float64 array with id,x,y,z of all objects
let lastRunAtMs = Date.now()
export function step(): Float64Array {
  const now = Date.now()
  const simulatedMs = now - lastRunAtMs
  lastRunAtMs = now
  system.advance(<f64>simulatedMs * SIM_SPEED) // around 0.1

  // Iterate the bodies and fill out the array
  const ret = new Float64Array(system.bodies.length * FLOATS_PER_BODY_OUT)
  for (let i = 0; i < system.bodies.length; i++) {
    const body = system.bodies[i]
    const j = i * FLOATS_PER_BODY_OUT
    ret[j + 0] = body.id // number
    ret[j + 1] = body.x // au
    ret[j + 2] = body.y // au
    ret[j + 3] = body.z // au
    ret[j + 4] = body.mass // solar mass
  }
  return ret
}

/**
 * Re-initializes the n-body system
 * @param bodyFloats array of x,y,z,vx,vy,vz,mass for each body in the system
 * @returns number of bodies in system
 */
export function initialize(bodyFloats: Float64Array): float {
  const f = bodyFloats
  bodyCount = 0
  system.bodies = []
  let i = 0
  while (i < f.length)
    add(
      f[i++], // x au
      f[i++], // y au
      f[i++], // z au
      f[i++] * Body.DAYS_PER_YEAR, // vx au/day -> au/year
      f[i++] * Body.DAYS_PER_YEAR, // vy
      f[i++] * Body.DAYS_PER_YEAR, // vz
      f[i++] * Body.SOLAR_MASS, // mass solar masses
    )
  system.offsetMomentum()
  return system.bodies.length
}
