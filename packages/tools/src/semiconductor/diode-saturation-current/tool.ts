import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiodeSaturationCurrentInput = {
  readonly forwardCurrentMa: number;
  readonly forwardVoltageV: number;
  readonly idealityFactor?: number;
  readonly temperatureK?: number;
};

export type DiodeSaturationCurrentOutput = {
  readonly saturationCurrentPicoA: number;
};

const BOLTZMANN_J_PER_K = 1.380649e-23;
const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const diodeSaturationCurrentExample = {
  input: {
    forwardCurrentMa: 1,
    forwardVoltageV: 0.65,
    idealityFactor: 1,
    temperatureK: 300,
  },
  output: { saturationCurrentPicoA: 0.012035956194828341 },
} satisfies ToolExample<
  DiodeSaturationCurrentInput,
  DiodeSaturationCurrentOutput
>;

export const calculateDiodeSaturationCurrent = (
  input: DiodeSaturationCurrentInput,
): DiodeSaturationCurrentOutput => {
  const forwardCurrentMa = input.forwardCurrentMa;
  const forwardVoltageV = input.forwardVoltageV;
  const idealityFactor = input.idealityFactor ?? 1;
  const temperatureK = input.temperatureK ?? 300;

  if (!Number.isFinite(forwardCurrentMa) || forwardCurrentMa <= 0)
    simpleError(
      "forwardCurrentMa",
      "Forward current must be a finite positive number greater than 0 mA.",
      "invalid_current",
    );
  if (!Number.isFinite(forwardVoltageV) || forwardVoltageV <= 0)
    simpleError(
      "forwardVoltageV",
      "Forward voltage must be a finite positive number greater than 0 V.",
      "invalid_voltage",
    );
  if (!Number.isFinite(idealityFactor) || idealityFactor < 1)
    simpleError(
      "idealityFactor",
      "Ideality factor must be a finite number at least 1.",
      "invalid_ideality",
    );
  if (!Number.isFinite(temperatureK) || temperatureK <= 0)
    simpleError(
      "temperatureK",
      "Temperature must be a finite positive number greater than 0 K.",
      "invalid_temperature",
    );

  const thermalVoltage =
    (BOLTZMANN_J_PER_K * temperatureK) / ELEMENTARY_CHARGE_C;
  if (!Number.isFinite(thermalVoltage) || thermalVoltage <= 0)
    simpleError(
      "temperatureK",
      "Thermal voltage could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );

  const nVt = idealityFactor * thermalVoltage;
  if (!Number.isFinite(nVt) || nVt <= 0)
    simpleError(
      "idealityFactor",
      "Ideality times thermal voltage overflowed.",
      "numeric_overflow",
    );

  const exponentArg = forwardVoltageV / nVt;
  if (!Number.isFinite(exponentArg))
    simpleError(
      "forwardVoltageV",
      "Exponent argument overflowed.",
      "numeric_overflow",
    );

  const logDenominator =
    exponentArg > 50
      ? exponentArg + Math.log1p(-Math.exp(-exponentArg))
      : Math.log(Math.expm1(exponentArg));
  const logSaturationPicoA =
    Math.log(forwardCurrentMa) + Math.log(1e9) - logDenominator;
  const saturationCurrentPicoA = Math.exp(logSaturationPicoA);
  if (!Number.isFinite(saturationCurrentPicoA) || saturationCurrentPicoA === 0)
    simpleError(
      "forwardVoltageV",
      "Saturation current is outside the representable positive range.",
      saturationCurrentPicoA === 0 ? "numeric_underflow" : "numeric_overflow",
    );

  return {
    saturationCurrentPicoA:
      saturationCurrentPicoA === 0 ? 0 : saturationCurrentPicoA,
  };
};

export const diodeSaturationCurrentTool = createSimpleTool({
  calculate: (input) =>
    calculateDiodeSaturationCurrent({
      forwardCurrentMa: input.forwardCurrentMa as number,
      forwardVoltageV: input.forwardVoltageV as number,
      idealityFactor: (input.idealityFactor as number | undefined) ?? undefined,
      temperatureK: (input.temperatureK as number | undefined) ?? undefined,
    }),
  description:
    "Extract the positive Shockley saturation-current parameter from one forward-bias point using Is = I/[exp(V/(n·Vt))−1]. The logarithmic evaluation remains stable at high forward voltage. This parameter is not necessarily equal to a diode's measured reverse-leakage current.",
  id: "semiconductor/diode-saturation-current",
  inputs: [
    {
      description: "Measured forward current. Must be greater than 0 mA.",
      id: "forwardCurrentMa",
      kind: "number",
      label: "Forward current",
      minimum: Number.MIN_VALUE,
      unit: "mA",
    },
    {
      description: "Measured forward voltage. Must be greater than 0 V.",
      id: "forwardVoltageV",
      kind: "number",
      label: "Forward voltage",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
    {
      default: 1,
      description: "Diode ideality factor. Must be at least 1.",
      id: "idealityFactor",
      kind: "number",
      label: "Ideality factor",
      minimum: 1,
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
        "Positive saturation-current parameter of the fitted Shockley equation.",
      format: "current-pa",
      id: "saturationCurrentPicoA",
      kind: "number",
      label: "Saturation current",
      minimum: Number.MIN_VALUE,
      unit: "pA",
    },
  ],
  title: "Diode Saturation Current Calculator",
});
export const runDiodeSaturationCurrent = diodeSaturationCurrentTool.execute;
export default diodeSaturationCurrentTool;
