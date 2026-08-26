import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type GenomicEstimatedBreedingValueInput = {
  readonly genomicEbv: number;
  readonly genomicWeight?: number;
  readonly pedigreeEbv: number;
};

export type GenomicEstimatedBreedingValueOutput = {
  readonly genomicEstimatedBreedingValue: number;
};

export const genomicEstimatedBreedingValueExample = {
  input: { genomicEbv: 10, genomicWeight: 0.6, pedigreeEbv: 4 },
  output: { genomicEstimatedBreedingValue: 7.6 },
} satisfies ToolExample<
  GenomicEstimatedBreedingValueInput,
  GenomicEstimatedBreedingValueOutput
>;

export const genomicEstimatedBreedingValueTool = createSimpleTool({
  id: "biology/genomic-estimated-breeding-value",
  title: "GEBV Blend",
  description:
    "Blend a genomic estimated breeding value and a pedigree estimated breeding value using a weighted average.",
  inputs: [
    {
      description: "Signed genomic estimated breeding value.",
      id: "genomicEbv",
      label: "Genomic EBV",
      kind: "number",
    },
    {
      default: 0.5,
      description: "Weight given to the genomic component.",
      id: "genomicWeight",
      label: "Genomic weight",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Signed pedigree-based estimated breeding value.",
      id: "pedigreeEbv",
      label: "Pedigree EBV",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "genomicEstimatedBreedingValue",
      label: "GEBV",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const genomicWeight = input.genomicWeight as number;
    return {
      genomicEstimatedBreedingValue:
        genomicWeight * (input.genomicEbv as number) +
        (1 - genomicWeight) * (input.pedigreeEbv as number),
    };
  },
});
export const runGenomicEstimatedBreedingValue =
  genomicEstimatedBreedingValueTool.execute;
export default genomicEstimatedBreedingValueTool;
