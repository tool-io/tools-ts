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
    input.itemScores.some((v) => !Number.isSafeInteger(v) || v < 0 || v > 4)
  )
    simpleError(
      "itemScores",
      "Exactly fourteen Berg Balance Scale items scored zero through four required.",
    );
  const totalScore = input.itemScores.reduce((a, b) => a + b, 0);
  return {
    totalScore,
    maximumScore: 56,
    percentMaximum: (100 * totalScore) / 56,
  };
};
export const exampleInput = {
  itemScores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
} satisfies Input;
export const exampleOutput = {
  totalScore: 56,
  maximumScore: 56,
  percentMaximum: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/berg-balance-score",
  title: "Berg Balance Score",
  description:
    "Sum fourteen Berg Balance Scale item scores on the 56-point scale.",
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
