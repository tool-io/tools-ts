import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrossoverAltitudeInput = {
  readonly casKt: number;
  readonly machNumber: number;
};

export type CrossoverAltitudeOutput = {
  readonly crossoverAltitudeFt: number;
};

const SPEED_OF_SOUND_KT = 661.4788;
const LAPSE_FACTOR_PER_FT = 6.87559e-6;
const PRESSURE_EXPONENT = 4.2561;
const MIN_ALTITUDE_FT = 0;
const MAX_ALTITUDE_FT = 45000;
const BISECTION_ITERATIONS = 80;

const crossingFunction = (
  altitudeFt: number,
  machNumber: number,
  casKt: number,
): number =>
  machNumber *
    SPEED_OF_SOUND_KT *
    Math.sqrt(1 - LAPSE_FACTOR_PER_FT * altitudeFt) -
  casKt /
    Math.sqrt(
      Math.pow(1 - LAPSE_FACTOR_PER_FT * altitudeFt, PRESSURE_EXPONENT),
    );

export const crossoverAltitudeExample = {
  input: { casKt: 300, machNumber: 0.8 },
  output: { crossoverAltitudeFt: 28249.49213029242 },
} satisfies ToolExample<CrossoverAltitudeInput, CrossoverAltitudeOutput>;

export const calculateCrossoverAltitude = (
  input: CrossoverAltitudeInput,
): CrossoverAltitudeOutput => {
  const atLow = crossingFunction(
    MIN_ALTITUDE_FT,
    input.machNumber,
    input.casKt,
  );
  const atHigh = crossingFunction(
    MAX_ALTITUDE_FT,
    input.machNumber,
    input.casKt,
  );
  if (!(atLow > 0 && atHigh < 0))
    simpleError(
      "casKt",
      "The given Mach number and CAS do not bracket a crossover altitude between 0 and 45,000 ft.",
      "no_crossing_error",
    );
  let low = MIN_ALTITUDE_FT;
  let high = MAX_ALTITUDE_FT;
  for (let iteration = 0; iteration < BISECTION_ITERATIONS; iteration += 1) {
    const mid = (low + high) / 2;
    if (crossingFunction(mid, input.machNumber, input.casKt) > 0) low = mid;
    else high = mid;
  }
  return { crossoverAltitudeFt: (low + high) / 2 };
};

export const crossoverAltitudeTool = createSimpleTool({
  calculate: (input) =>
    calculateCrossoverAltitude(input as unknown as CrossoverAltitudeInput),
  description:
    "Find by bisection the altitude where a constant Mach number and a constant calibrated airspeed correspond to the same true airspeed.",
  id: "aviation/crossover-altitude",
  inputs: [
    {
      description: "Constant Mach number held during the climb.",
      id: "machNumber",
      kind: "number",
      label: "Mach number",
      maximum: 0.95,
      minimum: 0.1,
    },
    {
      description: "Constant calibrated airspeed held below the crossover.",
      id: "casKt",
      kind: "number",
      label: "Calibrated airspeed",
      maximum: 400,
      minimum: 100,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Altitude at which the Mach and CAS segments meet, in feet.",
      format: "altitude",
      id: "crossoverAltitudeFt",
      kind: "number",
      label: "Crossover altitude",
      unit: "ft",
    },
  ],
  title: "Crossover Altitude Calculator",
});
export const runCrossoverAltitude = crossoverAltitudeTool.execute;
export default crossoverAltitudeTool;
