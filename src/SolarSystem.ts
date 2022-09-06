import { FLOATS_PER_BODY_IN, SOLAR_MASS_KG } from './config'
/**
 * Units are in au and days. See https://ssd.jpl.nasa.gov/horizons/app.html#/
 */
export class SolarBody {
  constructor(
    public name: string,
    public x: number,
    public y: number,
    public z: number,
    public vx: number,
    public vy: number,
    public vz: number,
    public mass: number,
  ) {}
}

/**
 * Used to create a float array that is passed to AssemblyScript simulation
 *
 * Output Units:
 * - distance: au
 * - time:     year
 * - velocity: au/year
 * - mass:     solar mass
 * See https://ssd.jpl.nasa.gov/horizons/app.html#/
 * See SolarSystems.txt for results
 */

export class SolarSystem {
  public bodies: SolarBody[] = []

  /**
   *
   * @returns Float64Array() w/ 7-float data: x,y,z,vx,vy,vz, mass in au, au/day, and solar mass
   */
  getBodyFloats(): Float64Array {
    const ret = new Float64Array(this.bodies.length * FLOATS_PER_BODY_IN)
    for (let i = 0; i < this.bodies.length * FLOATS_PER_BODY_IN; i += FLOATS_PER_BODY_IN) {
      const b = this.bodies[i / FLOATS_PER_BODY_IN]
      ret[i + 0] = b.x // au
      ret[i + 1] = b.y // au
      ret[i + 2] = b.z // au
      ret[i + 3] = b.vx // au/day
      ret[i + 4] = b.vy // au/day
      ret[i + 5] = b.vz // au/day
      ret[i + 6] = b.mass / SOLAR_MASS_KG // convert kg -> solar mass
    }
    return ret
  }

  constructor() {
    this.bodies.push(new SolarBody('sun', 0, 0, 0, 0, 0, 0, SOLAR_MASS_KG))
    this.bodies.push(
      new SolarBody(
        'mercury',
        // Sept 6th.  All other dates Sept 5th unless otherwise noted
        1.640525891787346e-1,
        -4.124121065349878e-1,
        -4.875007712690157e-2,
        2.050682427549712e-2,
        1.181664949913838e-2,
        -9.153680045483464e-4,
        /* Sept 5th
        1.432863722222231e-1, // au
        -4.235419396595179e-1, // au
        -4.775478953172087e-2, // au
        2.101244746627596e-2, // au/day
        1.044175316988441e-2, // au/day
        -1.074103121909918e-3, // au/day
        */
        3.302e23,
      ),
    )
    this.bodies.push(
      new SolarBody(
        'venus',
        -4.608774630514015e-1,
        5.500824867292884e-1,
        3.414532237527634e-2,
        -1.55750089777461e-2,
        -1.309817657488516e-2,
        7.188994883357223e-4,
        48.685e23,
      ),
    )
    this.bodies.push(
      new SolarBody(
        'earth',
        9.545682720585584e-1,
        -3.257887465774096e-1,
        1.261710008390235e-5,
        5.270604344293079e-3,
        1.621880611176765e-2,
        -2.889134141371156e-7,
        5.97219e24,
      ),
    )
    this.bodies.push(
      new SolarBody(
        'mars',
        1.309629827385804,
        5.458826092184975e-1,
        -2.068400048085259e-2,
        -4.848724708620588e-3,
        1.41134932101335e-2,
        4.147320762614949e-4,
        6.4171e23,
      ),
    )
    this.bodies.push(
      new SolarBody(
        'jupiter',
        4.954075348237988,
        1.11660068780363e-1,
        -1.113024362346103e-1,
        -2.583616002119229e-4,
        7.906540553333266e-3,
        -2.7047562463838e-5,
        189818722e22,
      ),
    )
    this.bodies.push(
      new SolarBody(
        'saturn',
        7.794950713621157,
        -6.042297658508447,
        -2.051530677340302e-1,
        3.107318134338408e-3,
        4.405976512919261e-3,
        -2.002239435463322e-4,
        5.6834e26,
      ),
    )
    this.bodies.push(
      new SolarBody(
        'uranus',
        1.371289211078732e1,
        1.412582335324506e1,
        -1.252692894624272e-1,
        -2.85152633103152e-3,
        2.5643953746695e-3,
        4.620924351381868e-5,
        86.813e24,
      ),
    )
    this.bodies.push(
      new SolarBody(
        'neptune',
        2.972425565260083e1,
        -3.317609819654142,
        -6.167219363896337e-1,
        3.27746032466992e-4,
        3.147414648983985e-3,
        -7.217483920467006e-5,
        102.409e24,
      ),
    )
    this.bodies.push(
      new SolarBody(
        'chiron',
        1.83024201577717e1,
        4.400534270162847,
        6.21363333977501e-1,
        -8.626121239810132e-4,
        2.993669264891864e-3,
        -3.681090710268461e-4,
        4000e15,
      ),
    )
  }
}
