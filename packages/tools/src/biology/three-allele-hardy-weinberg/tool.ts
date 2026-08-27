import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const threeAlleleHardyWeinbergExample = {
  input: {
    genotypeCount11: 6,
    genotypeCount12: 3,
    genotypeCount13: 1,
    genotypeCount22: 4,
    genotypeCount23: 2,
    genotypeCount33: 4,
  },
  output: {
    alleleFrequencyP1: 0.4,
    alleleFrequencyP2: 0.325,
    alleleFrequencyP3: 0.275,
  },
} satisfies ToolExample<
  {
    readonly genotypeCount11: number;
    readonly genotypeCount12: number;
    readonly genotypeCount13: number;
    readonly genotypeCount22: number;
    readonly genotypeCount23: number;
    readonly genotypeCount33: number;
  },
  {
    readonly alleleFrequencyP1: number;
    readonly alleleFrequencyP2: number;
    readonly alleleFrequencyP3: number;
  }
>;

export const threeAlleleHardyWeinbergTool = createSimpleTool({
  id: "biology/three-allele-hardy-weinberg",
  title: "Three Allele Frequencies",
  description:
    "Estimate allele frequencies p1, p2 and p3 from three-allele genotype counts using gene counting: pi = (2*nii + sum of heterozygote counts with allele i) / (2*N).",
  inputs: [
    {
      id: "genotypeCount11",
      kind: "integer",
      label: "Genotype 1/1 count",
      minimum: 0,
    },
    {
      id: "genotypeCount12",
      kind: "integer",
      label: "Genotype 1/2 count",
      minimum: 0,
    },
    {
      id: "genotypeCount13",
      kind: "integer",
      label: "Genotype 1/3 count",
      minimum: 0,
    },
    {
      id: "genotypeCount22",
      kind: "integer",
      label: "Genotype 2/2 count",
      minimum: 0,
    },
    {
      id: "genotypeCount23",
      kind: "integer",
      label: "Genotype 2/3 count",
      minimum: 0,
    },
    {
      id: "genotypeCount33",
      kind: "integer",
      label: "Genotype 3/3 count",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "alleleFrequencyP1",
      kind: "number",
      label: "Allele frequency p1",
    },
    {
      id: "alleleFrequencyP2",
      kind: "number",
      label: "Allele frequency p2",
    },
    {
      id: "alleleFrequencyP3",
      kind: "number",
      label: "Allele frequency p3",
    },
  ],
  calculate: (input) => {
    const c11 = input.genotypeCount11 as number;
    const c12 = input.genotypeCount12 as number;
    const c13 = input.genotypeCount13 as number;
    const c22 = input.genotypeCount22 as number;
    const c23 = input.genotypeCount23 as number;
    const c33 = input.genotypeCount33 as number;
    const total = c11 + c12 + c13 + c22 + c23 + c33;
    if (!(total > 0)) simpleError("genotypeCount11", "Total must be positive.");
    return {
      alleleFrequencyP1: (2 * c11 + c12 + c13) / (2 * total),
      alleleFrequencyP2: (2 * c22 + c12 + c23) / (2 * total),
      alleleFrequencyP3: (2 * c33 + c13 + c23) / (2 * total),
    };
  },
});
export const runThreeAlleleHardyWeinberg = threeAlleleHardyWeinbergTool.execute;
export default threeAlleleHardyWeinbergTool;
