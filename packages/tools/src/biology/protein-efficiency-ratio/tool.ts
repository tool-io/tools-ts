import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProteinEfficiencyRatioInput = {
  readonly proteinConsumedG: number;
  readonly weightGainG: number;
};

export type ProteinEfficiencyRatioOutput = {
  readonly proteinEfficiencyRatio: number;
};

export const proteinEfficiencyRatioExample = {
  input: { proteinConsumedG: 30, weightGainG: 60 },
  output: { proteinEfficiencyRatio: 2 },
} satisfies ToolExample<
  ProteinEfficiencyRatioInput,
  ProteinEfficiencyRatioOutput
>;

export const proteinEfficiencyRatioTool = createSimpleTool({
  id: "biology/protein-efficiency-ratio",
  title: "PER Calculator",
  description:
    "Compute the protein efficiency ratio as weight gain in grams divided by protein consumed in grams; the ratio is signed and cannot fall below minus one.",
  inputs: [
    {
      description: "Protein consumed in grams; must be greater than zero.",
      id: "proteinConsumedG",
      kind: "number",
      label: "Protein consumed",
      unit: "g",
    },
    {
      description:
        "Weight gain in grams; signed, and no lower than negative the protein consumed.",
      id: "weightGainG",
      kind: "number",
      label: "Weight gain",
      unit: "g",
    },
  ],
  outputs: [
    {
      description:
        "Protein efficiency ratio; signed grams of gain per gram of protein.",
      id: "proteinEfficiencyRatio",
      kind: "number",
      label: "Protein efficiency ratio",
      unit: "g/g",
    },
  ],
  calculate: (input) => {
    const proteinConsumedG = input.proteinConsumedG as number;
    const weightGainG = input.weightGainG as number;
    if (!(proteinConsumedG > 0))
      simpleError(
        "proteinConsumedG",
        "The protein consumed must be greater than zero.",
      );
    if (!(weightGainG >= -proteinConsumedG))
      simpleError(
        "weightGainG",
        "The weight gain must not be lower than negative the protein consumed.",
        "invalid_weight_gain",
      );
    return { proteinEfficiencyRatio: weightGainG / proteinConsumedG };
  },
});
export const runProteinEfficiencyRatio = proteinEfficiencyRatioTool.execute;
export default proteinEfficiencyRatioTool;
