import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly cleaveAsp: boolean;
}>;
export type Output = Readonly<{
  readonly cleavagePositions: readonly number[];
  readonly cleavageCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    cleavagePositions: number[] = [];
  for (let i = 0; i < s.length - 1; i++)
    if (s[i] === "E" || (input.cleaveAsp && s[i] === "D"))
      cleavagePositions.push(i + 1);
  return { cleavagePositions, cleavageCount: cleavagePositions.length };
};
export const exampleInput = {
  sequence: "AEDAEA",
  cleaveAsp: true,
} satisfies Input;
export const exampleOutput = {
  cleavagePositions: [2, 3, 5],
  cleavageCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/gluc-cleavage",
  title: "GLUC Cleavage",
  description:
    "Locate Glu-C acidic-residue cleavage sites with a caller Asp option.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "cleaveAsp", label: "Cleave asp", kind: "boolean" },
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
      cleaveAsp: value.cleaveAsp as boolean,
    }),
});
export const run = tool.execute;
export default tool;
