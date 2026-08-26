import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HardyWeinbergAlleleFrequencyInput = {
  readonly homozygousDominantCount: number;
  readonly heterozygousCount: number;
  readonly homozygousRecessiveCount: number;
};

export type HardyWeinbergAlleleFrequencyOutput = {
  readonly alleleFrequencyP: number;
};

export const hardyWeinbergAlleleFrequencyExample = {
  input: {
    homozygousDominantCount: 40,
    heterozygousCount: 40,
    homozygousRecessiveCount: 20,
  },
  output: { alleleFrequencyP: 0.6 },
} satisfies ToolExample<
  HardyWeinbergAlleleFrequencyInput,
  HardyWeinbergAlleleFrequencyOutput
>;

export const hardyWeinbergAlleleFrequencyTool = createSimpleTool({
  id: "biology/hardy-weinberg-allele-frequency",
  title: "Allele Frequency p",
  description:
    "Estimate dominant allele frequency p from genotype counts using p = (2*AA + Aa) / (2*total).",
  inputs: [
    {
      id: "homozygousDominantCount",
      label: "Homozygous dominant (AA)",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "heterozygousCount",
      label: "Heterozygous (Aa)",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "homozygousRecessiveCount",
      label: "Homozygous recessive (aa)",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "alleleFrequencyP", label: "Allele frequency p", kind: "number" },
  ],
  calculate: (input) => {
    const total =
      (input.homozygousDominantCount as number) +
      (input.heterozygousCount as number) +
      (input.homozygousRecessiveCount as number);
    if (!(total > 0))
      simpleError("heterozygousCount", "Total must be positive.");
    return {
      alleleFrequencyP:
        (2 * (input.homozygousDominantCount as number) +
          (input.heterozygousCount as number)) /
        (2 * total),
    };
  },
});
export const runHardyWeinbergAlleleFrequency =
  hardyWeinbergAlleleFrequencyTool.execute;
export default hardyWeinbergAlleleFrequencyTool;
