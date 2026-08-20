import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

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
  output: { saturationCurrentPicoA: 0.0120359561947 },
} satisfies ToolExample<DiodeSaturationCurrentInput, DiodeSaturationCurrentOutput>;

export const calculateDiodeSaturationCurrent = (
  input: DiodeSaturationCurrentInput,
): DiodeSaturationCurrentOutput => {
  const ideality = input.idealityFactor ?? 1;
  const temperatureK = input.temperatureK ?? 300;
  if (ideality < 1)
    simpleError(
      "idealityFactor",
      "The ideality factor cannot be below one.",
      "invalid_ideality",
    );
  if (temperatureK <= 0)
    simpleError(
      "temperatureK",
      "Temperature must be positive.",
      "invalid_temperature",
    );
  if (input.forwardVoltageV <= 0 || input.forwardCurrentMa <= 0)
    simpleError(
      "forwardVoltageV",
      "Provide a positive forward bias point.",
      "invalid_bias_point",
    );
  const thermalVoltage =
    (BOLTZMANN_J_PER_K * temperatureK) / ELEMENTARY_CHARGE_C;
  const saturationA =
    ((input.forwardCurrentMa * 1e-3) /
      Math.exp(input.forwardVoltageV / (ideality * thermalVoltage)));
  return { saturationCurrentPicoA: roundStatistic(saturationA * 1e12) };
};

export const diodeSaturationCurrentTool = createSimpleTool({
  calculate: (input) =>
    calculateDiodeSaturationCurrent(
      input as unknown as DiodeSaturationCurrentInput,
    ),
  description:
    "Extract the diode saturation current from one forward bias point via the ideal diode law.",
  id: "semiconductor/diode-saturation-current",
  inputs: [
    {
      description: "Measured forward current.",
      id: "forwardCurrentMa",
      kind: "number",
      label: "Forward current",
      unit: "mA",
    },
    {
      description: "Measured forward voltage.",
      id: "forwardVoltageV",
      kind: "number",
      label: "Forward voltage",
      unit: "V",
    },
    {
      default: 1,
      description: "Diode ideality factor.",
      id: "idealityFactor",
      kind: "number",
      label: "Ideality factor",
      minimum: 1,
    },
    {
      default: 300,
      description: "Device temperature.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      unit: "K",
    },
  ],
  outputs: [
    {
      description: "Saturation (reverse leakage) current.",
      format: "current-pa",
      id: "saturationCurrentPicoA",
      kind: "number",
      label: "Saturation current",
      unit: "pA",
    },
  ],
  title: "Diode Saturation Current Calculator",
});
export const runDiodeSaturationCurrent = diodeSaturationCurrentTool.execute;
export default diodeSaturationCurrentTool;
