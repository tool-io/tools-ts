import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BroadSenseHeritabilityInput = {
  readonly genotypicVariance: number;
  readonly phenotypicVariance: number;
};

export type BroadSenseHeritabilityOutput = {
  readonly broadSenseHeritability: number;
};

export const broadSenseHeritabilityExample = {
  input: { genotypicVariance: 3, phenotypicVariance: 8 },
  output: { broadSenseHeritability: 0.375 },
} satisfies ToolExample<
  BroadSenseHeritabilityInput,
  BroadSenseHeritabilityOutput
>;

export const broadSenseHeritabilityTool = createSimpleTool({
  id: "biology/broad-sense-heritability",
  title: "Broad-Sense Heritability",
  description:
    "Compute broad-sense heritability as the ratio of total genotypic variance to phenotypic variance.",
  inputs: [
    { id: "genotypicVariance", label: "Genotypic variance", kind: "number" },
    { id: "phenotypicVariance", label: "Phenotypic variance", kind: "number" },
  ],
  outputs: [
    {
      id: "broadSenseHeritability",
      label: "Broad-sense heritability",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const genotypicVariance = input.genotypicVariance as number;
    const phenotypicVariance = input.phenotypicVariance as number;
    if (
      !(phenotypicVariance > 0) ||
      genotypicVariance < 0 ||
      genotypicVariance > phenotypicVariance
    )
      simpleError(
        "phenotypicVariance",
        "Phenotypic variance must be positive; genotypic variance cannot be negative or exceed phenotypic variance.",
        "invalid_variances",
      );
    return { broadSenseHeritability: genotypicVariance / phenotypicVariance };
  },
});
export const runBroadSenseHeritability = broadSenseHeritabilityTool.execute;
export default broadSenseHeritabilityTool;
