import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NarrowSenseHeritabilityInput = {
  readonly additiveGeneticVariance: number;
  readonly phenotypicVariance: number;
};

export type NarrowSenseHeritabilityOutput = {
  readonly narrowSenseHeritability: number;
};

export const narrowSenseHeritabilityExample = {
  input: { additiveGeneticVariance: 2, phenotypicVariance: 8 },
  output: { narrowSenseHeritability: 0.25 },
} satisfies ToolExample<
  NarrowSenseHeritabilityInput,
  NarrowSenseHeritabilityOutput
>;

export const narrowSenseHeritabilityTool = createSimpleTool({
  id: "biology/narrow-sense-heritability",
  title: "Narrow-Sense Heritability",
  description:
    "Compute narrow-sense heritability as the ratio of additive genetic variance to phenotypic variance.",
  inputs: [
    {
      id: "additiveGeneticVariance",
      label: "Additive genetic variance",
      kind: "number",
    },
    { id: "phenotypicVariance", label: "Phenotypic variance", kind: "number" },
  ],
  outputs: [
    {
      id: "narrowSenseHeritability",
      label: "Narrow-sense heritability",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const additiveGeneticVariance = input.additiveGeneticVariance as number;
    const phenotypicVariance = input.phenotypicVariance as number;
    if (
      !(phenotypicVariance > 0) ||
      !(additiveGeneticVariance > 0) ||
      additiveGeneticVariance > phenotypicVariance
    )
      simpleError(
        "phenotypicVariance",
        "Variances must be positive and additive genetic variance cannot exceed phenotypic variance.",
        "invalid_variances",
      );
    return {
      narrowSenseHeritability: additiveGeneticVariance / phenotypicVariance,
    };
  },
});
export const runNarrowSenseHeritability = narrowSenseHeritabilityTool.execute;
export default narrowSenseHeritabilityTool;
