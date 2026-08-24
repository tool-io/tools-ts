import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FillFactorInput = {
  readonly openCircuitVoltage: number;
  readonly idealityFactor?: number;
  readonly temperatureKelvin?: number;
};

export type FillFactorOutput = {
  readonly fillFactor: number;
};

const BOLTZMANN_EV_PER_K = 8.617333262e-5;

export const fillFactorExample = {
  input: { openCircuitVoltage: 0.6 },
  output: { fillFactor: 0.8275399076142578 },
} satisfies ToolExample<FillFactorInput, FillFactorOutput>;

export const fillFactorTool = createSimpleTool({
  id: "semiconductor/solar-cell-fill-factor",
  title: "Fill Factor Calculator",
  description:
    "Estimate the ideal solar cell fill factor from its open-circuit voltage with the empirical logarithmic formula.",
  inputs: [
    {
      description: "Open-circuit voltage of the cell.",
      id: "openCircuitVoltage",
      kind: "number",
      label: "Open-circuit voltage",
      unit: "V",
    },
    {
      default: 300,
      description: "Cell temperature used to calculate thermal voltage.",
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature",
      unit: "K",
    },
    {
      default: 1,
      description:
        "Diode ideality factor used to normalize open-circuit voltage.",
      id: "idealityFactor",
      kind: "number",
      label: "Ideality factor",
    },
  ],
  outputs: [
    {
      description: "Estimated fill factor between 0 and 1.",
      format: "factor",
      id: "fillFactor",
      kind: "number",
      label: "Fill factor",
    },
  ],
  calculate: (input) => {
    const openCircuitVoltage = input.openCircuitVoltage as number;
    const temperatureKelvin = input.temperatureKelvin as number;
    const idealityFactor = input.idealityFactor as number;
    if (!(openCircuitVoltage > 0))
      simpleError(
        "openCircuitVoltage",
        "Open-circuit voltage must be positive.",
        "invalid_open_circuit_voltage",
      );
    if (!(temperatureKelvin > 0))
      simpleError("temperatureKelvin", "Temperature must be positive.");
    if (!(idealityFactor > 0))
      simpleError("idealityFactor", "Ideality factor must be positive.");
    const vNorm =
      openCircuitVoltage /
      (idealityFactor * BOLTZMANN_EV_PER_K * temperatureKelvin);
    if (vNorm < 10)
      simpleError(
        "openCircuitVoltage",
        "Normalized open-circuit voltage must be at least 10 for this approximation.",
        "outside_model_range",
      );
    return {
      fillFactor: (vNorm - Math.log(vNorm + 0.72)) / (vNorm + 1),
    };
  },
});
export const runFillFactor = fillFactorTool.execute;
export default fillFactorTool;
