import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly phosphoserineIndexes: readonly number[];
}>;
export type Output = Readonly<{
  readonly motifStarts: readonly number[];
  readonly supportedCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    supported = new Set(input.phosphoserineIndexes),
    motifStarts: number[] = [];
  for (let i = 0; i <= s.length - 6; i++)
    if (/^RS.S.P$/.test(s.slice(i, i + 6)) && supported.has(i + 3))
      motifStarts.push(i);
  return { motifStarts, supportedCount: motifStarts.length };
};
export const exampleInput = {
  sequence: "RSASAP",
  phosphoserineIndexes: [3],
} satisfies Input;
export const exampleOutput = {
  motifStarts: [0],
  supportedCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/phosphoserine-adapter-motifs",
  title: "Phosphoserine Adapter Motifs",
  description:
    "Match RS-X-pS-X-P adapter motifs against measured phosphoserine positions.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    {
      id: "phosphoserineIndexes",
      label: "Phosphoserine indexes",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "motifStarts", label: "Motif starts", kind: "numberList" },
    { id: "supportedCount", label: "Supported count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      phosphoserineIndexes: value.phosphoserineIndexes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
