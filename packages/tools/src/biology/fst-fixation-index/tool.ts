import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FstFixationIndexInput = {
  readonly alleleFrequencyX: number;
  readonly alleleFrequencyY: number;
};

export type FstFixationIndexOutput = {
  readonly fixationIndexFst: number;
};

export const fstFixationIndexExample = {
  input: { alleleFrequencyX: 0.6, alleleFrequencyY: 0.2 },
  output: { fixationIndexFst: 0.16666666666666682 },
} satisfies ToolExample<FstFixationIndexInput, FstFixationIndexOutput>;

export const fstFixationIndexTool = createSimpleTool({
  id: "biology/fst-fixation-index",
  title: "FST Fixation Index",
  description:
    "Compute the fixation index fst = (ht - hs) / ht for two populations at a two-allele locus.",
  inputs: [
    {
      id: "alleleFrequencyX",
      label: "Population X allele A frequency",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "alleleFrequencyY",
      label: "Population Y allele A frequency",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    { id: "fixationIndexFst", label: "Fixation index FST", kind: "number" },
  ],
  calculate: (input) => {
    const pX = input.alleleFrequencyX as number;
    const pY = input.alleleFrequencyY as number;
    const heX = 1 - (pX * pX + (1 - pX) * (1 - pX));
    const heY = 1 - (pY * pY + (1 - pY) * (1 - pY));
    const hs = (heX + heY) / 2;
    const meanP = (pX + pY) / 2;
    const ht = 1 - (meanP * meanP + (1 - meanP) * (1 - meanP));
    if (ht === 0)
      simpleError(
        "alleleFrequencyX",
        "FST is undefined when both populations are fixed for the same allele.",
        "zero_total_heterozygosity",
      );
    return { fixationIndexFst: (ht - hs) / ht };
  },
});
export const runFstFixationIndex = fstFixationIndexTool.execute;
export default fstFixationIndexTool;
