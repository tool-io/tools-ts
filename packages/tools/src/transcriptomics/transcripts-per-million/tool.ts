import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly transcriptCounts: readonly number[];
  readonly effectiveLengthsBp: readonly number[];
}>;
export type Output = Readonly<{
  readonly tpm: readonly number[];
  readonly totalTpm: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.transcriptCounts.length;
  if (
    n === 0 ||
    input.effectiveLengthsBp.length !== n ||
    input.transcriptCounts.some((v) => v < 0) ||
    input.effectiveLengthsBp.some((v) => v <= 0)
  )
    simpleError(
      "effectiveLengthsBp",
      "Aligned nonnegative counts and positive effective lengths required.",
    );
  const perKb = input.transcriptCounts.map(
      (v, i) => v / (input.effectiveLengthsBp[i] / 1000),
    ),
    total = perKb.reduce((a, b) => a + b, 0);
  if (total <= 0)
    simpleError("transcriptCounts", "At least one nonzero count required.");
  const tpm = perKb.map((v) => (v / total) * 1e6);
  return { tpm, totalTpm: tpm.reduce((a, b) => a + b, 0) };
};
export const exampleInput = {
  transcriptCounts: [100, 100],
  effectiveLengthsBp: [1000, 2000],
} satisfies Input;
export const exampleOutput = {
  tpm: [666666.6666666666, 333333.3333333333],
  totalTpm: 1000000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "transcriptomics/transcripts-per-million",
  title: "Transcripts Per Million",
  description:
    "Normalize transcript length-adjusted abundances to one million TPM.",
  inputs: [
    { id: "transcriptCounts", kind: "numberList", label: "Transcript counts" },
    {
      id: "effectiveLengthsBp",
      kind: "numberList",
      label: "Effective lengths bp",
    },
  ],
  outputs: [
    { id: "tpm", kind: "numberList", label: "Tpm" },
    { id: "totalTpm", kind: "number", label: "Total tpm" },
  ],
  calculate: (value) =>
    calculate({
      transcriptCounts: value.transcriptCounts as readonly number[],
      effectiveLengthsBp: value.effectiveLengthsBp as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
