import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type GenomicRelationshipInput = {
  readonly alleleFrequencyVarianceSum: number;
  readonly centeredGenotypeCrossProduct: number;
};

export type GenomicRelationshipOutput = {
  readonly genomicRelationship: number;
};

export const genomicRelationshipExample = {
  input: {
    alleleFrequencyVarianceSum: 10,
    centeredGenotypeCrossProduct: 10,
  },
  output: { genomicRelationship: 0.5 },
} satisfies ToolExample<GenomicRelationshipInput, GenomicRelationshipOutput>;

export const genomicRelationshipTool = createSimpleTool({
  id: "biology/genomic-relationship",
  title: "VanRaden Genomic Relationship",
  description:
    "Calculate one off-diagonal genomic relationship using VanRaden's first-method scaling: the cross-product of centered marker genotypes divided by twice the sum of p(1−p) across markers. Negative estimates are possible after centering.",
  inputs: [
    {
      description:
        "Cross-product of both individuals' centered marker dosages.",
      id: "centeredGenotypeCrossProduct",
      label: "Centered genotype cross-product",
      kind: "number",
    },
    {
      description: "Sum of p(1−p) over the markers used in the cross-product.",
      id: "alleleFrequencyVarianceSum",
      label: "Allele-frequency variance sum",
      kind: "number",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "genomicRelationship",
      label: "Genomic relationship",
      kind: "number",
    },
  ],
  calculate: (input) => ({
    genomicRelationship:
      (input.centeredGenotypeCrossProduct as number) /
      (2 * (input.alleleFrequencyVarianceSum as number)),
  }),
});
export const runGenomicRelationship = genomicRelationshipTool.execute;
export default genomicRelationshipTool;
