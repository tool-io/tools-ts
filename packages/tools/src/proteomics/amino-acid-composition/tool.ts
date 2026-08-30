import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly residueSymbols: readonly string[];
  readonly counts: readonly number[];
  readonly percentages: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    residueSymbols = [...new Set(s)].sort(),
    counts = residueSymbols.map((v) => [...s].filter((c) => c === v).length);
  return {
    residueSymbols,
    counts,
    percentages: counts.map((v) => (v / s.length) * 100),
  };
};
export const exampleInput = { sequence: "AA" } satisfies Input;
export const exampleOutput = {
  residueSymbols: ["A"],
  counts: [2],
  percentages: [100],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/amino-acid-composition",
  title: "Amino Acid Composition",
  description: "Tabulate amino-acid counts and composition percentages.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "residueSymbols", label: "Residue symbols", kind: "stringList" },
    { id: "counts", label: "Counts", kind: "numberList" },
    { id: "percentages", label: "Percentages", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
