import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly motif: string;
}>;
export type Output = Readonly<{
  readonly longestTandemRun: number;
  readonly runStart: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    motif = proteinSequence(input.motif);
  let longestTandemRun = 0,
    runStart = -1;
  for (let i = 0; i <= s.length - motif.length; i++) {
    let count = 0;
    while (
      s.slice(i + count * motif.length, i + (count + 1) * motif.length) ===
      motif
    )
      count++;
    if (count > longestTandemRun) {
      longestTandemRun = count;
      runStart = i;
    }
  }
  return { longestTandemRun, runStart };
};
export const exampleInput = { sequence: "ACACAC", motif: "AC" } satisfies Input;
export const exampleOutput = {
  longestTandemRun: 3,
  runStart: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/tandem-repeat-count",
  title: "Tandem Repeat Count",
  description:
    "Find the longest consecutive tandem repeat of a supplied peptide motif.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "motif", label: "Motif", kind: "string" },
  ],
  outputs: [
    { id: "longestTandemRun", label: "Longest tandem run", kind: "number" },
    { id: "runStart", label: "Run start", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      motif: value.motif as string,
    }),
});
export const run = tool.execute;
export default tool;
