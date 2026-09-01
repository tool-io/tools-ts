import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  sum,
  weights,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerOrientedFourFactorScores: readonly number[];
  readonly callerFourFactorWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerWeightedFourFactorScore: number;
}>;
const inputFields = [
  {
    id: "callerOrientedFourFactorScores",
    label: "Caller oriented four factor scores",
    kind: "numberList",
  },
  {
    id: "callerFourFactorWeights",
    label: "Caller four factor weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.callerOrientedFourFactorScores.length !== 4 ||
    input.callerFourFactorWeights.length !== 4
  )
    simpleError(
      "factors",
      "Four caller consistently oriented factor scores required.",
    );
  input.callerOrientedFourFactorScores.forEach((v) => fraction(v, "scores"));
  const w = weights(input.callerFourFactorWeights);
  return {
    callerWeightedFourFactorScore: sum(
      w.map((v, i) => v * input.callerOrientedFourFactorScores[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerOrientedFourFactorScores: [0.5, 0.2, 0.3, 0.4],
  callerFourFactorWeights: [0.4, 0.25, 0.2, 0.15],
} satisfies Input;
export const exampleOutput = {
  callerWeightedFourFactorScore: 0.37,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/basketball-four-factor-fourf-score",
  title: "Four Factors Composite Score",
  description:
    "Combine caller already consistently oriented basketball eFG/turnover/rebound/free-throw scores with explicit weights; no assumed low-turnover sign or canonical universal four-factor composite.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerWeightedFourFactorScore",
      label: "Caller weighted four factor score",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerOrientedFourFactorScores:
        value.callerOrientedFourFactorScores as readonly number[],
      callerFourFactorWeights:
        value.callerFourFactorWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
