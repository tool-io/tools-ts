import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly cleavagePositions: readonly number[];
  readonly cleavageCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    cleavagePositions: number[] = [];
  for (let i = 0; i < s.length - 1; i++)
    if (s[i] === "K") cleavagePositions.push(i + 1);
  return { cleavagePositions, cleavageCount: cleavagePositions.length };
};
export const exampleInput = { sequence: "AKAKKA" } satisfies Input;
export const exampleOutput = {
  cleavagePositions: [2, 4, 5],
  cleavageCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/lysc-cleavage",
  title: "LYSC Cleavage",
  description: "Locate Lys-C cleavage sites after internal lysines.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
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
    }),
});
export const run = tool.execute;
export default tool;
