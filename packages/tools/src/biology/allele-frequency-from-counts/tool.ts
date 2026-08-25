import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AlleleFrequencyFromCountsInput = {
  readonly countAA: number;
  readonly countAB: number;
  readonly countBB: number;
};

export type AlleleFrequencyFromCountsOutput = {
  readonly alleleAFrequency: number;
};

export const alleleFrequencyFromCountsExample = {
  input: { countAA: 20, countAB: 30, countBB: 10 },
  output: { alleleAFrequency: 0.5833333333333334 },
} satisfies ToolExample<
  AlleleFrequencyFromCountsInput,
  AlleleFrequencyFromCountsOutput
>;

export const alleleFrequencyFromCountsTool = createSimpleTool({
  id: "biology/allele-frequency-from-counts",
  title: "Allele Freq From Counts",
  description:
    "Compute allele A frequency p = (2*AA + AB) / (2*(AA + AB + BB)) from genotype counts.",
  inputs: [
    { id: "countAA", label: "AA count", kind: "integer", minimum: 0 },
    { id: "countAB", label: "AB count", kind: "integer", minimum: 0 },
    { id: "countBB", label: "BB count", kind: "integer", minimum: 0 },
  ],
  outputs: [
    { id: "alleleAFrequency", label: "Allele A frequency", kind: "number" },
  ],
  calculate: (input) => {
    const denominator =
      2 *
      ((input.countAA as number) +
        (input.countAB as number) +
        (input.countBB as number));
    if (!(denominator > 0))
      simpleError("countAA", "Total genotype count must be positive.");
    return {
      alleleAFrequency:
        (2 * (input.countAA as number) + (input.countAB as number)) /
        denominator,
    };
  },
});
export const runAlleleFrequencyFromCounts =
  alleleFrequencyFromCountsTool.execute;
export default alleleFrequencyFromCountsTool;
