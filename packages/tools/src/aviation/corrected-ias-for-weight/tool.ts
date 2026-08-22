import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CorrectedIasForWeightInput = {
  readonly currentWeightLb: number;
  readonly iasKt: number;
  readonly referenceWeightLb: number;
};

export type CorrectedIasForWeightOutput = {
  readonly correctedIasKt: number;
};

export const correctedIasForWeightExample = {
  input: { currentWeightLb: 2400, iasKt: 100, referenceWeightLb: 2000 },
  output: { correctedIasKt: 109.54451150103321 },
} satisfies ToolExample<
  CorrectedIasForWeightInput,
  CorrectedIasForWeightOutput
>;

export const calculateCorrectedIasForWeight = (
  input: CorrectedIasForWeightInput,
): CorrectedIasForWeightOutput => {
  if (input.referenceWeightLb <= 0 || input.currentWeightLb <= 0)
    simpleError(
      "referenceWeightLb",
      "Weights must be positive.",
      "invalid_weight",
    );
  return {
    correctedIasKt:
      input.iasKt * Math.sqrt(input.currentWeightLb / input.referenceWeightLb),
  };
};

export const correctedIasForWeightTool = createSimpleTool({
  calculate: (input) =>
    calculateCorrectedIasForWeight(
      input as unknown as CorrectedIasForWeightInput,
    ),
  description:
    "Correct an indicated airspeed for weight using the square-root weight ratio.",
  id: "aviation/corrected-ias-for-weight",
  inputs: [
    {
      description: "Actual aircraft weight.",
      id: "currentWeightLb",
      kind: "number",
      label: "Current weight",
      unit: "lb",
    },
    {
      description: "IAS from the handbook at the reference weight.",
      id: "iasKt",
      kind: "number",
      label: "Reference IAS",
      unit: "kt",
    },
    {
      description: "Reference weight for the published IAS.",
      id: "referenceWeightLb",
      kind: "number",
      label: "Reference weight",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "IAS adjusted for the actual weight.",
      format: "speed",
      id: "correctedIasKt",
      kind: "number",
      label: "Corrected IAS",
      unit: "kt",
    },
  ],
  title: "Corrected IAS For Weight Calculator",
});
export const runCorrectedIasForWeight = correctedIasForWeightTool.execute;
export default correctedIasForWeightTool;
