import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HardyWeinbergGenotypeFrequencyInput = {
  readonly alleleFrequencyP: number;
};

export type HardyWeinbergGenotypeFrequencyOutput = {
  readonly expectedHeterozygous: number;
  readonly expectedHomoDominant: number;
  readonly expectedHomoRecessive: number;
};

export const hardyWeinbergGenotypeFrequencyExample = {
  input: { alleleFrequencyP: 0.6 },
  output: {
    expectedHomoDominant: 0.36,
    expectedHeterozygous: 0.48,
    expectedHomoRecessive: 0.16000000000000003,
  },
} satisfies ToolExample<
  HardyWeinbergGenotypeFrequencyInput,
  HardyWeinbergGenotypeFrequencyOutput
>;

export const hardyWeinbergGenotypeFrequencyTool = createSimpleTool({
  id: "biology/hardy-weinberg-genotype-frequency",
  title: "Genotype Frequencies",
  description:
    "Compute expected Hardy-Weinberg genotype frequencies p^2, 2pq, and q^2 from an allele frequency.",
  inputs: [
    {
      id: "alleleFrequencyP",
      label: "Allele frequency p",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "expectedHomoDominant",
      label: "Expected AA",
      kind: "number",
    },
    {
      id: "expectedHeterozygous",
      label: "Expected Aa",
      kind: "number",
    },
    {
      id: "expectedHomoRecessive",
      label: "Expected aa",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const p = input.alleleFrequencyP as number;
    const q = 1 - p;
    return {
      expectedHomoDominant: p * p,
      expectedHeterozygous: 2 * p * q,
      expectedHomoRecessive: q * q,
    };
  },
});
export const runHardyWeinbergGenotypeFrequency =
  hardyWeinbergGenotypeFrequencyTool.execute;
export default hardyWeinbergGenotypeFrequencyTool;
