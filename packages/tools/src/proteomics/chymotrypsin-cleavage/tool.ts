import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly blockBeforeProline: boolean;
}>;
export type Output = Readonly<{
  readonly cleavagePositions: readonly number[];
  readonly cleavageCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    cleavagePositions: number[] = [];
  for (let i = 0; i < s.length - 1; i++)
    if ("FYW".includes(s[i]) && (!input.blockBeforeProline || s[i + 1] !== "P"))
      cleavagePositions.push(i + 1);
  return { cleavagePositions, cleavageCount: cleavagePositions.length };
};
export const exampleInput = {
  sequence: "AFAYWPA",
  blockBeforeProline: true,
} satisfies Input;
export const exampleOutput = {
  cleavagePositions: [2, 4],
  cleavageCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/chymotrypsin-cleavage",
  title: "Chymotrypsin Cleavage",
  description:
    "Locate aromatic chymotrypsin cleavage sites with optional proline blocking.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    {
      id: "blockBeforeProline",
      label: "Block before proline",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "cleavagePositions",
      label: "Cleavage positions",
      kind: "numberList",
    },
    { id: "cleavageCount", label: "Cleavage count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      blockBeforeProline: value.blockBeforeProline as boolean,
    }),
});
export const run = tool.execute;
export default tool;
