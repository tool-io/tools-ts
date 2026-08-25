import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const dominanceVarianceExample = {
  input: { dominanceVariance: 0.125, totalGeneticVariance: 0.5 },
} satisfies ToolExample<{
  readonly dominanceVariance: number;
  readonly totalGeneticVariance: number;
}>;

export const dominanceVarianceTool = createSimpleTool({
  id: "biology/dominance-variance",
  title: "Dominance Variance Share",
  description:
    "Express the dominance variance component as a percentage of the total genetic variance.",
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
  ],
  outputs: [
    {
      id: "dominanceSharePercent",
      label: "Dominance share",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const totalGeneticVariance = input.totalGeneticVariance as number;
    const dominanceVariance = input.dominanceVariance as number;
    if (totalGeneticVariance <= 0)
      simpleError(
        "totalGeneticVariance",
        "Total genetic variance must be positive.",
        "invalid_components",
      );
    if (dominanceVariance > totalGeneticVariance)
      simpleError(
        "dominanceVariance",
        "Dominance variance must not exceed the total genetic variance.",
        "invalid_components",
      );
    return {
      dominanceSharePercent: (dominanceVariance / totalGeneticVariance) * 100,
    };
  },
});
export const runDominanceVariance = dominanceVarianceTool.execute;
export default dominanceVarianceTool;
