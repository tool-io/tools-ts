import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { trypsinCutPositions } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly cleavagePositions: readonly number[];
  readonly cleavageCount: number;
}>;
export const calculate = (input: Input): Output => {
  const cleavagePositions = trypsinCutPositions(input.sequence);
  return { cleavagePositions, cleavageCount: cleavagePositions.length };
};
export const exampleInput = { sequence: "AKRPA" } satisfies Input;
export const exampleOutput = {
  cleavagePositions: [2],
  cleavageCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/trypsin-cleavage-sites",
  title: "Trypsin Cleavage Sites",
  description: "Locate trypsin cut positions at K/R not followed by proline.",
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
