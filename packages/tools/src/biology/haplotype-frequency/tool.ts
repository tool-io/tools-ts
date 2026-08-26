import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const haplotypeFrequencyExample = {
  input: { haplotypeCount: 12, individualsTotal: 25 },
  output: { haplotypeFrequency: 0.24 },
} satisfies ToolExample<
  { readonly haplotypeCount: number; readonly individualsTotal: number },
  { readonly haplotypeFrequency: number }
>;

export const haplotypeFrequencyTool = createSimpleTool({
  id: "biology/haplotype-frequency",
  title: "Haplotype Frequency",
  description:
    "Compute haplotype frequency as haplotype count divided by two times the total number of individuals.",
  inputs: [
    {
      id: "haplotypeCount",
      kind: "integer",
      label: "Haplotype count",
      minimum: 0,
    },
    {
      id: "individualsTotal",
      kind: "integer",
      label: "Total individuals",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "haplotypeFrequency",
      kind: "number",
      label: "Haplotype frequency",
    },
  ],
  calculate: (input) => {
    const haplotypeCount = input.haplotypeCount as number;
    const individualsTotal = input.individualsTotal as number;
    if (haplotypeCount > 2 * individualsTotal)
      simpleError(
        "haplotypeCount",
        "Haplotype count must not exceed two copies per diploid individual.",
        "invalid_count",
      );
    return { haplotypeFrequency: haplotypeCount / (2 * individualsTotal) };
  },
});
export const runHaplotypeFrequency = haplotypeFrequencyTool.execute;
export default haplotypeFrequencyTool;
