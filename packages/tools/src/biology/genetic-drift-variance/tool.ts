import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const geneticDriftVarianceExample = {
  input: { alleleFrequencyP: 0.5, effectivePopulationSizeInt: 100 },
  output: { driftVariance: 0.00125 },
} satisfies ToolExample<
  {
    readonly alleleFrequencyP: number;
    readonly effectivePopulationSizeInt: number;
  },
  { readonly driftVariance: number }
>;

export const geneticDriftVarianceTool = createSimpleTool({
  id: "biology/genetic-drift-variance",
  title: "Drift Variance",
  description:
    "Compute the expected one-generation variance in allele frequency under diploid Wright-Fisher drift: p × (1 - p) / (2Ne), where Ne is the effective number of breeding individuals.",
  inputs: [
    {
      id: "alleleFrequencyP",
      kind: "number",
      label: "Allele frequency p",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "effectivePopulationSizeInt",
      kind: "integer",
      label: "Effective population size Ne",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "driftVariance",
      kind: "number",
      label: "Drift variance",
    },
  ],
  calculate: (input) => {
    const alleleFrequencyP = input.alleleFrequencyP as number;
    return {
      driftVariance:
        (alleleFrequencyP * (1 - alleleFrequencyP)) /
        (2 * (input.effectivePopulationSizeInt as number)),
    };
  },
});
export const runGeneticDriftVariance = geneticDriftVarianceTool.execute;
export default geneticDriftVarianceTool;
