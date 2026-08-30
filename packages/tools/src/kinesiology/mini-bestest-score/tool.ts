import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly itemScores: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalScore: number;
  readonly maximumScore: number;
  readonly percentMaximum: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.itemScores.length !== 14 ||
    input.itemScores.some((v) => !Number.isSafeInteger(v) || v < 0 || v > 2)
  )
    simpleError(
      "itemScores",
      "Exactly fourteen Mini-BESTest items scored zero through two required.",
    );
  const totalScore = input.itemScores.reduce((a, b) => a + b, 0);
  return {
    totalScore,
    maximumScore: 28,
    percentMaximum: (100 * totalScore) / 28,
  };
};
export const exampleInput = {
  itemScores: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
} satisfies Input;
export const exampleOutput = {
  totalScore: 28,
  maximumScore: 28,
  percentMaximum: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/mini-bestest-score",
  title: "Mini Bestest Score",
  description: "Sum fourteen Mini-BESTest item scores on the 28-point scale.",
  inputs: [{ id: "itemScores", label: "Item scores", kind: "numberList" }],
  outputs: [
    { id: "totalScore", label: "Total score", kind: "number" },
    { id: "maximumScore", label: "Maximum score", kind: "number" },
    { id: "percentMaximum", label: "Percent maximum", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      itemScores: value.itemScores as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
