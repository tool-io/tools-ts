import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly sequonStarts: readonly number[];
  readonly sequonCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    sequonStarts: number[] = [];
  for (let i = 0; i <= s.length - 3; i++)
    if (s[i] === "N" && s[i + 1] !== "P" && "ST".includes(s[i + 2]))
      sequonStarts.push(i);
  return { sequonStarts, sequonCount: sequonStarts.length };
};
export const exampleInput = { sequence: "NATSNPS" } satisfies Input;
export const exampleOutput = {
  sequonStarts: [0],
  sequonCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/n-glycosylation-sequons",
  title: "N Glycosylation Sequons",
  description:
    "Locate N-X-S/T glycosylation sequons excluding proline in the X site.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "sequonStarts", label: "Sequon starts", kind: "numberList" },
    { id: "sequonCount", label: "Sequon count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
