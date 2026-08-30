import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly readHaplotypes: readonly string[];
  readonly expectedCpgCount: number;
}>;
export type Output = Readonly<{
  readonly haplotypes: readonly string[];
  readonly counts: readonly number[];
  readonly phasedReadCount: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.expectedCpgCount < 1 ||
    input.readHaplotypes.some(
      (v) => v.length !== input.expectedCpgCount || /[^01]/.test(v),
    )
  )
    simpleError(
      "readHaplotypes",
      "Haplotypes must have aligned binary CpG calls.",
    );
  const counts = new Map<string, number>();
  for (const v of input.readHaplotypes) counts.set(v, (counts.get(v) ?? 0) + 1);
  return {
    haplotypes: [...counts.keys()],
    counts: [...counts.values()],
    phasedReadCount: input.readHaplotypes.length,
  };
};

export const exampleInput = {
  readHaplotypes: ["01", "11", "01", "00"],
  expectedCpgCount: 2,
} satisfies Input;
export const exampleOutput = {
  haplotypes: ["01", "11", "00"],
  counts: [2, 1, 1],
  phasedReadCount: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/methylation-haplotype-tally",
  title: "Methylation Haplotype Tally",
  description: "Tally methylation haplotypes across phased binary reads.",
  inputs: [
    { id: "readHaplotypes", kind: "stringList", label: "Read haplotypes" },
    { id: "expectedCpgCount", kind: "number", label: "Expected cpg count" },
  ],
  outputs: [
    { id: "haplotypes", kind: "stringList", label: "Haplotypes" },
    { id: "counts", kind: "numberList", label: "Counts" },
    { id: "phasedReadCount", kind: "number", label: "Phased read count" },
  ],
  calculate: (value) =>
    calculate({
      readHaplotypes: value.readHaplotypes as readonly string[],
      expectedCpgCount: value.expectedCpgCount as number,
    }),
});
export const run = tool.execute;
export default tool;
