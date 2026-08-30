import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly captiveScores: readonly number[];
  readonly independentScores: readonly number[];
}>;
export type Output = Readonly<{
  readonly captiveTotal: number;
  readonly independentTotal: number;
  readonly higherScoringModel: string;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.captiveScores.length === 0 ||
    input.captiveScores.length !== input.independentScores.length
  )
    simpleError(
      "captiveScores",
      "Score lists must be nonempty and equal length.",
      "length_mismatch",
    );
  const sum = (values: readonly number[]) =>
    values.reduce((total, value) => total + value, 0);
  const captiveTotal = sum(input.captiveScores);
  const independentTotal = sum(input.independentScores);
  return {
    captiveTotal,
    independentTotal,
    higherScoringModel:
      captiveTotal === independentTotal
        ? "tie"
        : captiveTotal > independentTotal
          ? "captive"
          : "independent",
  };
};

export const exampleInput = {
  captiveScores: [4, 2, 3],
  independentScores: [3, 4, 4],
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  captiveScores: [1, 1],
  independentScores: [1, 1],
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      captiveScores: input.captiveScores as readonly number[],
      independentScores: input.independentScores as readonly number[],
    }),
  description:
    "Compare caller-scored producer models across the same criteria.",
  id: "insurance/producer-model-comparison",
  inputs: [
    { id: "captiveScores", label: "Captive-model scores", kind: "numberList" },
    {
      id: "independentScores",
      label: "Independent-model scores",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "captiveTotal", label: "Captive total", kind: "number" },
    { id: "independentTotal", label: "Independent total", kind: "number" },
    {
      id: "higherScoringModel",
      label: "Higher-scoring model",
      kind: "string",
      enum: ["captive", "independent", "tie"],
    },
  ],
  title: "Producer Model Comparison",
});

export const run = tool.execute;
export default tool;
