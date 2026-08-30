import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly elapsedYears: readonly number[];
  readonly scores: readonly number[];
  readonly expectedPracticeOffsets: readonly number[];
}>;
export type Output = Readonly<{
  readonly adjustedScores: readonly number[];
  readonly changePerYear: number;
  readonly interceptScore: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "elapsedYears", label: "Elapsed years", kind: "numberList" },
  { id: "scores", label: "Scores", kind: "numberList" },
  {
    id: "expectedPracticeOffsets",
    label: "Expected practice offsets",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.elapsedYears, "elapsedYears");
  aligned(input.elapsedYears, input.scores, "elapsedYears");
  aligned(input.scores, input.expectedPracticeOffsets, "scores");
  const adjustedScores = input.scores.map(
      (v, i) => v - input.expectedPracticeOffsets[i],
    ),
    fit = regression(input.elapsedYears, adjustedScores);
  return {
    adjustedScores,
    changePerYear: fit.slope,
    interceptScore: fit.intercept,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  elapsedYears: [0, 1, 2],
  scores: [20, 18, 16],
  expectedPracticeOffsets: [0, 1, 1],
} satisfies Input;
export const exampleOutput = {
  adjustedScores: [20, 17, 15],
  changePerYear: -2.5,
  interceptScore: 19.833333333333332,
  fitRSquared: 0.9868421052631579,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/practice-adjusted-cognitive-decline-slope",
  title: "Cognitive Decline Slope",
  description:
    "Fit longitudinal cognitive score change after caller-supplied visit-specific practice offsets; score direction and diagnostic interpretation are not assumed.",
  inputs: inputFields,
  outputs: [
    { id: "adjustedScores", label: "Adjusted scores", kind: "numberList" },
    { id: "changePerYear", label: "Change per year", kind: "number" },
    { id: "interceptScore", label: "Intercept score", kind: "number" },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      elapsedYears: value.elapsedYears as readonly number[],
      scores: value.scores as readonly number[],
      expectedPracticeOffsets:
        value.expectedPracticeOffsets as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
