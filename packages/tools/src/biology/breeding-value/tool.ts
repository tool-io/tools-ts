import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type BreedingValueInput = {
  readonly heritability: number;
  readonly phenotypeDeviation: number;
};

export type BreedingValueOutput = {
  readonly estimatedBreedingValue: number;
};

export const breedingValueExample = {
  input: { heritability: 0.6, phenotypeDeviation: 5 },
  output: { estimatedBreedingValue: 3 },
} satisfies ToolExample<BreedingValueInput, BreedingValueOutput>;

export const breedingValueTool = createSimpleTool({
  id: "biology/breeding-value",
  title: "Breeding Value EBV",
  description:
    "Estimate an individual breeding value as heritability times the signed phenotype deviation from the population mean.",
  inputs: [
    {
      id: "heritability",
      label: "Heritability",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      description:
        "Signed deviation of the phenotype from the population mean.",
      id: "phenotypeDeviation",
      label: "Phenotype deviation",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "estimatedBreedingValue",
      label: "Estimated breeding value",
      kind: "number",
    },
  ],
  calculate: (input) => ({
    estimatedBreedingValue:
      (input.heritability as number) * (input.phenotypeDeviation as number),
  }),
});
export const runBreedingValue = breedingValueTool.execute;
export default breedingValueTool;
