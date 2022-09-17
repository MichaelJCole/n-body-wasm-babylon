export * from '../assembly/config'

export const SIMULATION_MS_PER_STEP = 30 // ms
export const FILE_PATH = 'models/'
export const POSITION_SCALE = 8 // au / babylonUnit - see SolarSystem.ts
export const SIZE_SCALE = 1e6 // kg / au - see SolarSystem.ts

export const WASM_URL = 'NBodySystem.wasm'
export const WORKER_URL = 'WebWorker.js'
export const BODY_NAMES = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranis', 'Neptune']
export const SOLAR_MASS_KG = 1988500e24 // kg/solarmass about 2e30
