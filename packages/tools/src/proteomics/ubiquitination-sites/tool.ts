import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly lysineIndexes: readonly number[];
  readonly candidateCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    lysineIndexes = [...s].flatMap((v, i) => (v === "K" ? [i] : []));
  return { lysineIndexes, candidateCount: lysineIndexes.length };
};
export const exampleInput = { sequence: "AKK" } satisfies Input;
export const exampleOutput = {
  lysineIndexes: [1, 2],
  candidateCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/ubiquitination-sites",
  title: "Ubiquitination Sites",
  description:
    "Count lysine residues as potential ubiquitination sites, not confirmed sites.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "lysineIndexes", label: "Lysine indexes", kind: "numberList" },
    { id: "candidateCount", label: "Candidate count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
