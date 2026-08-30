import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly candidateIndexes: readonly number[];
  readonly serineCount: number;
  readonly threonineCount: number;
  readonly tyrosineCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    candidateIndexes = [...s].flatMap((v, i) => ("STY".includes(v) ? [i] : []));
  return {
    candidateIndexes,
    serineCount: [...s].filter((v) => v === "S").length,
    threonineCount: [...s].filter((v) => v === "T").length,
    tyrosineCount: [...s].filter((v) => v === "Y").length,
  };
};
export const exampleInput = { sequence: "ASTY" } satisfies Input;
export const exampleOutput = {
  candidateIndexes: [1, 2, 3],
  serineCount: 1,
  threonineCount: 1,
  tyrosineCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/phosphorylation-sites",
  title: "Phosphorylation Sites",
  description: "Count potential Ser/Thr/Tyr phosphorylation positions.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "candidateIndexes", label: "Candidate indexes", kind: "numberList" },
    { id: "serineCount", label: "Serine count", kind: "number" },
    { id: "threonineCount", label: "Threonine count", kind: "number" },
    { id: "tyrosineCount", label: "Tyrosine count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
