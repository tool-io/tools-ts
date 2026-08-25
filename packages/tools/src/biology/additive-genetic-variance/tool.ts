import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const additiveGeneticVarianceExample = {
  input: {
    dominanceVariance: 0.125,
    epistaticVariance: 0.125,
    totalGeneticVariance: 0.5,
  },
} satisfies ToolExample<{
  readonly dominanceVariance: number;
  readonly epistaticVariance: number;
  readonly totalGeneticVariance: number;
}>;

export const additiveGeneticVarianceTool = createSimpleTool({
  id: "biology/additive-genetic-variance",
  title: "Additive Variance Component",
  description:
    "Derive the additive genetic variance by subtracting dominance and epistatic components from the total genetic variance.",
  inputs: [
    {
      id: "totalGeneticVariance",
      label: "Total genetic variance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "dominanceVariance",
      label: "Dominance variance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "epistaticVariance",
      label: "Epistatic variance",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "additiveVariance", label: "Additive variance", kind: "number" },
  ],
  calculate: (input) => {
    const totalGeneticVariance = input.totalGeneticVariance as number;
    const dominanceVariance = input.dominanceVariance as number;
    const epistaticVariance = input.epistaticVariance as number;
    const additiveVariance =
      totalGeneticVariance - dominanceVariance - epistaticVariance;
    if (additiveVariance < 0)
      simpleError(
        "dominanceVariance",
        "Dominance and epistatic variances must not exceed the total genetic variance.",
        "negative_components",
      );
    return { additiveVariance };
  },
});
export const runAdditiveGeneticVariance = additiveGeneticVarianceTool.execute;
export default additiveGeneticVarianceTool;
