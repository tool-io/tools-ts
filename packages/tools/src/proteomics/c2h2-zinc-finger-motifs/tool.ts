import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly motifStarts: readonly number[];
  readonly motifCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    motifStarts: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const match = /^C.{2,4}C.{12}H.{3,4}H/.exec(s.slice(i));
    if (match) motifStarts.push(i);
  }
  return { motifStarts, motifCount: motifStarts.length };
};
export const exampleInput = {
  sequence: "CAACAAAAAAAAAAAAHAAAH",
} satisfies Input;
export const exampleOutput = {
  motifStarts: [0],
  motifCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/c2h2-zinc-finger-motifs",
  title: "C2H2 Zinc Finger Motifs",
  description: "Find C2H2 zinc-finger cysteine/histidine spacing patterns.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "motifStarts", label: "Motif starts", kind: "numberList" },
    { id: "motifCount", label: "Motif count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
