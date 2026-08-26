import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HeterozygosityExpectedInput = {
  readonly alleleFrequencyA: number;
};

export type HeterozygosityExpectedOutput = {
  readonly expectedHeterozygosity: number;
};

export const heterozygosityExpectedExample = {
  input: { alleleFrequencyA: 0.3 },
  output: { expectedHeterozygosity: 0.42000000000000004 },
} satisfies ToolExample<
  HeterozygosityExpectedInput,
  HeterozygosityExpectedOutput
>;

export const heterozygosityExpectedTool = createSimpleTool({
  id: "biology/heterozygosity-expected",
  title: "Expected Heterozygosity",
  description:
    "Compute expected heterozygosity he = 1 - (p^2 + q^2) at a two-allele locus.",
  inputs: [
    {
      id: "alleleFrequencyA",
      label: "Allele A frequency",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "expectedHeterozygosity",
      label: "Expected heterozygosity",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const p = input.alleleFrequencyA as number;
    const q = 1 - p;
    return { expectedHeterozygosity: 1 - (p * p + q * q) };
  },
});
export const runHeterozygosityExpected = heterozygosityExpectedTool.execute;
export default heterozygosityExpectedTool;
