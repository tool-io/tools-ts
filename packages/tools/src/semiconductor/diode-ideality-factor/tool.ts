import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiodeIdealityFactorInput = {
  readonly currentOneMa: number;
  readonly currentTwoMa: number;
  readonly temperatureK?: number;
  readonly voltageOneV: number;
  readonly voltageTwoV: number;
};

export type DiodeIdealityFactorOutput = {
  readonly idealityFactor: number;
};

const BOLTZMANN_J_PER_K = 1.380649e-23;
const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const diodeIdealityFactorExample = {
  input: {
    currentOneMa: 1,
    currentTwoMa: 10,
    temperatureK: 300,
    voltageOneV: 0.6,
    voltageTwoV: 0.7,
  },
  output: { idealityFactor: 1.679926061778496 },
} satisfies ToolExample<DiodeIdealityFactorInput, DiodeIdealityFactorOutput>;

export const calculateDiodeIdealityFactor = (
  input: DiodeIdealityFactorInput,
): DiodeIdealityFactorOutput => {
  const temperatureK = input.temperatureK ?? 300;
  const currentOneMa = input.currentOneMa;
  const currentTwoMa = input.currentTwoMa;
  const voltageOneV = input.voltageOneV;
  const voltageTwoV = input.voltageTwoV;

  if (!Number.isFinite(temperatureK) || temperatureK <= 0)
    simpleError(
      "temperatureK",
      "Temperature must be a finite positive number greater than 0 K.",
      "invalid_temperature",
    );
  if (!Number.isFinite(currentOneMa) || currentOneMa <= 0)
    simpleError(
      "currentOneMa",
      "First forward current must be a finite positive number greater than 0 mA.",
      "invalid_current",
    );
  if (!Number.isFinite(currentTwoMa) || currentTwoMa <= 0)
    simpleError(
      "currentTwoMa",
      "Second forward current must be a finite positive number greater than 0 mA.",
      "invalid_current",
    );
  if (currentOneMa === currentTwoMa)
    simpleError(
      "currentTwoMa",
      "Provide two distinct currents; I1 and I2 must differ.",
      "invalid_currents",
    );
  if (!Number.isFinite(voltageOneV))
    simpleError(
      "voltageOneV",
      "First forward voltage must be a finite number.",
      "invalid_voltage",
    );
  if (!Number.isFinite(voltageTwoV))
    simpleError(
      "voltageTwoV",
      "Second forward voltage must be a finite number.",
      "invalid_voltage",
    );

  const thermalVoltage =
    (BOLTZMANN_J_PER_K * temperatureK) / ELEMENTARY_CHARGE_C;
  if (!Number.isFinite(thermalVoltage) || thermalVoltage <= 0)
    simpleError(
      "temperatureK",
      "Thermal voltage could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );

  const ratio = currentTwoMa / currentOneMa;
  const lnRatio =
    Number.isFinite(ratio) && ratio > 0
      ? Math.log(ratio)
      : Math.log(currentTwoMa) - Math.log(currentOneMa);
  if (!Number.isFinite(lnRatio) || lnRatio === 0)
    simpleError(
      "currentTwoMa",
      "Logarithm of current ratio is zero or not finite; currents must be distinct and positive.",
      "invalid_currents",
    );

  const deltaV = voltageTwoV - voltageOneV;
  if (!Number.isFinite(deltaV))
    simpleError(
      "voltageTwoV",
      "Voltage difference overflowed.",
      "numeric_overflow",
    );

  const denominator = thermalVoltage * lnRatio;
  if (!Number.isFinite(denominator) || denominator === 0)
    simpleError(
      "temperatureK",
      "Denominator thermalVoltage·ln(I2/I1) overflowed or is zero.",
      "numeric_overflow",
    );

  const ideality = deltaV / denominator;
  if (!Number.isFinite(ideality))
    simpleError(
      "voltageTwoV",
      "Ideality factor could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );
  if (ideality <= 0)
    simpleError(
      "voltageTwoV",
      "The measurements do not imply a positive ideality factor; check that (V2-V1) and ln(I2/I1) have the same sign.",
      "invalid_measurements",
    );

  return { idealityFactor: ideality === 0 ? 0 : ideality };
};

export const diodeIdealityFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateDiodeIdealityFactor({
      currentOneMa: input.currentOneMa as number,
      currentTwoMa: input.currentTwoMa as number,
      temperatureK: (input.temperatureK as number | undefined) ?? undefined,
      voltageOneV: input.voltageOneV as number,
      voltageTwoV: input.voltageTwoV as number,
    }),
  description:
    "Extract the diode ideality factor n from two forward-bias points on the exponential Shockley relation. Formula: n = (V2 - V1) / (Vt·ln(I2/I1)), where thermal voltage Vt = k·T/q (k=1.380649e-23 J/K, q=1.602176634e-19 C). Inputs: I1>0 mA, I2>0 mA and I1≠I2, V1 and V2 finite V, T>0 K (default 300 K). Output: n>0 (physical diode typically 1 ≤ n ≤ 2; n=1 ideal diffusion, n≈2 recombination/generation; n outside 1-2 indicates series resistance, high injection, or measurement error). Assumes forward exponential region, negligible series resistance, and constant temperature.",
  id: "semiconductor/diode-ideality-factor",
  inputs: [
    {
      description: "First forward current. Must be greater than 0 mA.",
      id: "currentOneMa",
      kind: "number",
      label: "I1",
      minimum: Number.MIN_VALUE,
      unit: "mA",
    },
    {
      description:
        "Second forward current. Must be greater than 0 mA and distinct from I1.",
      id: "currentTwoMa",
      kind: "number",
      label: "I2",
      minimum: Number.MIN_VALUE,
      unit: "mA",
    },
    {
      description: "First forward voltage. Finite voltage in volts.",
      id: "voltageOneV",
      kind: "number",
      label: "V1",
      unit: "V",
    },
    {
      description:
        "Second forward voltage. Finite voltage in volts; (V2-V1) must have same sign as ln(I2/I1) for positive n.",
      id: "voltageTwoV",
      kind: "number",
      label: "V2",
      unit: "V",
    },
    {
      default: 300,
      description: "Device temperature. Must be greater than 0 K.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      minimum: Number.MIN_VALUE,
      unit: "K",
    },
  ],
  outputs: [
    {
      description:
        "Extracted ideality factor. Greater than 0; physical range typically 1 to 2.",
      format: "factor",
      id: "idealityFactor",
      kind: "number",
      label: "Ideality factor",
      minimum: Number.MIN_VALUE,
    },
  ],
  title: "Diode Ideality Factor Calculator",
});
export const runDiodeIdealityFactor = diodeIdealityFactorTool.execute;
export default diodeIdealityFactorTool;
