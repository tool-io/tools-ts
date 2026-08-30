import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly firstGametes: readonly string[];
  readonly firstProbabilities: readonly number[];
  readonly secondGametes: readonly string[];
  readonly secondProbabilities: readonly number[];
}>;
export type Output = Readonly<{
  readonly crossCells: readonly string[];
  readonly cellProbabilities: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.firstGametes, input.firstProbabilities, "firstGametes");
  aligned(input.secondGametes, input.secondProbabilities, "secondGametes");
  if (input.firstGametes.length * input.secondGametes.length > 100000)
    simpleError("firstGametes", "Grid is limited to 100000 combinations.");
  for (const p of [input.firstProbabilities, input.secondProbabilities]) {
    p.forEach((v) => fraction(v, "firstProbabilities"));
    if (Math.abs(p.reduce((a, b) => a + b, 0) - 1) > 1e-10)
      simpleError(
        "firstProbabilities",
        "Gamete probabilities must sum to one for each parent.",
      );
  }
  const crossCells: string[] = [],
    cellProbabilities: number[] = [];
  input.firstGametes.forEach((a, i) =>
    input.secondGametes.forEach((b, j) => {
      crossCells.push(`${a}×${b}`);
      cellProbabilities.push(
        input.firstProbabilities[i] * input.secondProbabilities[j],
      );
    }),
  );
  return { crossCells, cellProbabilities };
};
export const exampleInput = {
  firstGametes: ["A", "a"],
  firstProbabilities: [0.7, 0.3],
  secondGametes: ["A", "a"],
  secondProbabilities: [0.5, 0.5],
} satisfies Input;
export const exampleOutput = {
  crossCells: ["A×A", "A×a", "a×A", "a×a"],
  cellProbabilities: [0.35, 0.35, 0.15, 0.15],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/weighted-gamete-grid",
  title: "Weighted Gamete Grid",
  description:
    "Build a weighted gamete-combination grid allowing caller-supplied transmission probabilities.",
  inputs: [
    { id: "firstGametes", label: "First gametes", kind: "stringList" },
    {
      id: "firstProbabilities",
      label: "First probabilities",
      kind: "numberList",
    },
    { id: "secondGametes", label: "Second gametes", kind: "stringList" },
    {
      id: "secondProbabilities",
      label: "Second probabilities",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "crossCells", label: "Cross cells", kind: "stringList" },
    {
      id: "cellProbabilities",
      label: "Cell probabilities",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      firstGametes: value.firstGametes as readonly string[],
      firstProbabilities: value.firstProbabilities as readonly number[],
      secondGametes: value.secondGametes as readonly string[],
      secondProbabilities: value.secondProbabilities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
