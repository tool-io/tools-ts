import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const rarefactionCurveExample = {
  input: { sampleSizeInt: 50, speciesTotalInt: 20, totalIndividualsInt: 200 },
  output: { rarefiedRichness: 5 },
} satisfies ToolExample<
  {
    readonly sampleSizeInt: number;
    readonly speciesTotalInt: number;
    readonly totalIndividualsInt: number;
  },
  { readonly rarefiedRichness: number }
>;

export const rarefactionCurveTool = createSimpleTool({
  id: "biology/rarefaction-curve",
  title: "Rarefied Richness",
  description:
    "Estimate rarefied species richness with the documented linear form sTotal x m / n for a subsample of m individuals drawn from n.",
  inputs: [
    {
      id: "speciesTotalInt",
      label: "Total species",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "totalIndividualsInt",
      label: "Total individuals",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "sampleSizeInt",
      label: "Sample size",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "rarefiedRichness",
      label: "Rarefied richness",
      kind: "number",
      unit: "species",
    },
  ],
  calculate: (input) => {
    const totalIndividualsInt = input.totalIndividualsInt as number;
    const sampleSizeInt = input.sampleSizeInt as number;
    if (sampleSizeInt > totalIndividualsInt)
      simpleError(
        "sampleSizeInt",
        "Sample size must not exceed the total individuals.",
        "oversample",
      );
    return {
      rarefiedRichness:
        ((input.speciesTotalInt as number) * sampleSizeInt) /
        totalIndividualsInt,
    };
  },
});
export const runRarefactionCurve = rarefactionCurveTool.execute;
export default rarefactionCurveTool;
