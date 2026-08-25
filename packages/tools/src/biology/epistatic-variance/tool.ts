import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const epistaticVarianceExample = {
  input: { epistaticVariance: 0.125, totalGeneticVariance: 0.5 },
} satisfies ToolExample<{
  readonly epistaticVariance: number;
  readonly totalGeneticVariance: number;
}>;

export const epistaticVarianceTool = createSimpleTool({
  id: "biology/epistatic-variance",
  title: "Epistasis Variance Share",
  description:
    "Express the epistatic variance component as a percentage of the total genetic variance.",
  inputs: [
    {
      id: "totalGeneticVariance",
      label: "Total genetic variance",
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
    {
      id: "epistaticSharePercent",
      label: "Epistasis share",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const totalGeneticVariance = input.totalGeneticVariance as number;
    const epistaticVariance = input.epistaticVariance as number;
    if (totalGeneticVariance <= 0)
      simpleError(
        "totalGeneticVariance",
        "Total genetic variance must be positive.",
        "invalid_components",
      );
    if (epistaticVariance > totalGeneticVariance)
      simpleError(
        "epistaticVariance",
        "Epistatic variance must not exceed the total genetic variance.",
        "invalid_components",
      );
    return {
      epistaticSharePercent: (epistaticVariance / totalGeneticVariance) * 100,
    };
  },
});
export const runEpistaticVariance = epistaticVarianceTool.execute;
export default epistaticVarianceTool;
