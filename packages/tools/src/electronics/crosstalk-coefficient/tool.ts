import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrosstalkCoefficientInput = {
  readonly aggressorVoltageV: number;
  readonly coupledVoltageV: number;
};

export type CrosstalkCoefficientOutput = {
  readonly crosstalkDb: number;
};

export const crosstalkCoefficientExample = {
  input: { aggressorVoltageV: 2, coupledVoltageV: 0.02 },
  output: { crosstalkDb: -40 },
} satisfies ToolExample<CrosstalkCoefficientInput, CrosstalkCoefficientOutput>;

export const calculateCrosstalkCoefficient = (
  input: CrosstalkCoefficientInput,
): CrosstalkCoefficientOutput => {
  if (input.aggressorVoltageV === 0)
    simpleError(
      "aggressorVoltageV",
      "Aggressor voltage must be nonzero.",
      "must_be_nonzero",
    );
  if (!(input.coupledVoltageV >= 0))
    simpleError(
      "coupledVoltageV",
      "Coupled voltage cannot be negative.",
      "invalid_voltage",
    );
  return {
    crosstalkDb:
      20 * Math.log10(input.coupledVoltageV / input.aggressorVoltageV),
  };
};

export const crosstalkCoefficientTool = createSimpleTool({
  calculate: (input) =>
    calculateCrosstalkCoefficient(
      input as unknown as CrosstalkCoefficientInput,
    ),
  description:
    "Compute crosstalk in decibels as 20 x log10(coupled voltage / aggressor voltage).",
  id: "electronics/crosstalk-coefficient",
  inputs: [
    {
      id: "aggressorVoltageV",
      kind: "number",
      label: "Aggressor voltage",
      unit: "V",
    },
    {
      id: "coupledVoltageV",
      kind: "number",
      label: "Coupled voltage",
      unit: "V",
    },
  ],
  outputs: [
    { id: "crosstalkDb", kind: "number", label: "Crosstalk", unit: "dB" },
  ],
  title: "Crosstalk Coefficient",
});
export const runCrosstalkCoefficient = crosstalkCoefficientTool.execute;
export default crosstalkCoefficientTool;
