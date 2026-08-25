import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DisplacementLengthRatioInput = {
  readonly displacementLb: number;
  readonly waterlineLengthFt: number;
};

export type DisplacementLengthRatioOutput = {
  readonly displacementLengthRatio: number;
};

const LONG_TON_LB = 2240;

export const displacementLengthRatioExample = {
  input: { displacementLb: 8000, waterlineLengthFt: 28 },
} satisfies ToolExample<
  DisplacementLengthRatioInput,
  DisplacementLengthRatioOutput
>;

export const calculateDisplacementLengthRatio = (
  input: DisplacementLengthRatioInput,
): DisplacementLengthRatioOutput => {
  if (input.displacementLb <= 0 || input.waterlineLengthFt <= 0)
    simpleError(
      "displacementLb",
      "Displacement and waterline length must be positive.",
      "invalid_input",
    );
  const lengthRatio = input.waterlineLengthFt / 100;
  return {
    displacementLengthRatio:
      input.displacementLb / LONG_TON_LB / lengthRatio ** 3,
  };
};

export const displacementLengthRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateDisplacementLengthRatio(
      input as unknown as DisplacementLengthRatioInput,
    ),
  description:
    "Compute the displacement-to-length ratio; below two hundred is light, above three hundred is heavy.",
  id: "sailing/displacement-length-ratio",
  inputs: [
    {
      description: "Displacement in pounds.",
      format: "weight-lb",
      id: "displacementLb",
      kind: "number",
      label: "Displacement",
      unit: "lb",
    },
    {
      description: "Waterline length.",
      format: "length-ft",
      id: "waterlineLengthFt",
      kind: "number",
      label: "Waterline length",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description:
        "D/L ratio; under two hundred is light, over three hundred is heavy.",
      format: "ratio",
      id: "displacementLengthRatio",
      kind: "number",
      label: "D/L ratio",
    },
  ],
  title: "Displacement Length Ratio Calculator",
});
export const runDisplacementLengthRatio = displacementLengthRatioTool.execute;
export default displacementLengthRatioTool;
