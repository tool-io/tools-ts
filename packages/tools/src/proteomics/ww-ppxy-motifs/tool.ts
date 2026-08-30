import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly ligandStarts: readonly number[];
  readonly ligandCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    ligandStarts: number[] = [];
  for (let i = 0; i <= s.length - 4; i++)
    if (/^PP.Y$/.test(s.slice(i, i + 4))) ligandStarts.push(i);
  return { ligandStarts, ligandCount: ligandStarts.length };
};
export const exampleInput = { sequence: "PPAY" } satisfies Input;
export const exampleOutput = {
  ligandStarts: [0],
  ligandCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/ww-ppxy-motifs",
  title: "WW Ppxy Motifs",
  description: "Find PP-X-Y WW-domain ligand candidates.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "ligandStarts", label: "Ligand starts", kind: "numberList" },
    { id: "ligandCount", label: "Ligand count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
