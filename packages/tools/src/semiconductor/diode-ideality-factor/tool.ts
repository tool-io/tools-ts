import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

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
  output: { idealityFactor: 1.67992606178 },
} satisfies ToolExample<DiodeIdealityFactorInput, DiodeIdealityFactorOutput>;

export const calculateDiodeIdealityFactor = (
  input: DiodeIdealityFactorInput,
): DiodeIdealityFactorOutput => {
  const temperatureK = input.temperatureK ?? 300;
  if (temperatureK <= 0)
    simpleError(
      "temperatureK",
      "Temperature must be positive.",
      "invalid_temperature",
    );
  if (
    input.currentOneMa <= 0 ||
    input.currentTwoMa <= 0 ||
    input.currentOneMa === input.currentTwoMa
  )
    simpleError(
      "currentOneMa",
      "Provide two distinct positive currents.",
      "invalid_currents",
    );
  const thermalVoltage =
    (BOLTZMANN_J_PER_K * temperatureK) / ELEMENTARY_CHARGE_C;
  const ideality =
    (input.voltageTwoV - input.voltageOneV) /
    (thermalVoltage * Math.log(input.currentTwoMa / input.currentOneMa));
  if (!Number.isFinite(ideality) || ideality <= 0)
    simpleError(
      "voltageTwoV",
      "The measurements do not imply a positive ideality factor.",
      "invalid_measurements",
    );
  return { idealityFactor: roundStatistic(ideality) };
};

export const diodeIdealityFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateDiodeIdealityFactor(
      input as unknown as DiodeIdealityFactorInput,
    ),
  description:
    "Extract the diode ideality factor from two forward bias points on an exponential IV curve.",
  id: "semiconductor/diode-ideality-factor",
  inputs: [
    { description: "First forward current.", id: "currentOneMa", kind: "number", label: "I1", unit: "mA" },
    { description: "First forward voltage.", id: "voltageOneV", kind: "number", label: "V1", unit: "V" },
    { description: "Second forward current.", id: "currentTwoMa", kind: "number", label: "I2", unit: "mA" },
    { description: "Second forward voltage.", id: "voltageTwoV", kind: "number", label: "V2", unit: "V" },
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
      description: "Extracted ideality factor.",
      format: "factor",
      id: "idealityFactor",
      kind: "number",
      label: "Ideality factor",
    },
  ],
  title: "Diode Ideality Factor Calculator",
});
export const runDiodeIdealityFactor = diodeIdealityFactorTool.execute;
export default diodeIdealityFactorTool;
