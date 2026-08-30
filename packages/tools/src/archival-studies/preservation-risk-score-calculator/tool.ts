import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly callerHazardProbabilities: readonly number[];
  readonly callerLossValuesIfHazardOccurs: readonly number[];
  readonly callerRiskReviewThreshold: number;
}>;
export type Output = Readonly<{
  readonly expectedLossByHazard: readonly number[];
  readonly aboveCallerRiskReviewFlags: readonly number[];
  readonly sumOfDeclaredExpectedLosses: number;
}>;
const inputFields = [
  {
    id: "callerHazardProbabilities",
    label: "Caller hazard probabilities",
    kind: "numberList",
  },
  {
    id: "callerLossValuesIfHazardOccurs",
    label: "Caller loss values if hazard occurs",
    kind: "numberList",
  },
  {
    id: "callerRiskReviewThreshold",
    label: "Caller risk review threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerLossValuesIfHazardOccurs.forEach((v) =>
    nonnegative(v, "callerLossValuesIfHazardOccurs"),
  );
  nonnegative(input.callerRiskReviewThreshold, "callerRiskReviewThreshold");
  input.callerHazardProbabilities.forEach((v) =>
    fraction(v, "callerHazardProbabilities"),
  );
  aligned(
    input.callerHazardProbabilities,
    input.callerLossValuesIfHazardOccurs,
    "callerHazardProbabilities",
  );
  const losses = input.callerHazardProbabilities.map(
    (v, i) => v * input.callerLossValuesIfHazardOccurs[i],
  );
  return {
    expectedLossByHazard: losses,
    aboveCallerRiskReviewFlags: losses.map((v) =>
      v > input.callerRiskReviewThreshold ? 1 : 0,
    ),
    sumOfDeclaredExpectedLosses: sum(losses),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerHazardProbabilities: [0.1, 0.2],
  callerLossValuesIfHazardOccurs: [100, 200],
  callerRiskReviewThreshold: 20,
} satisfies Input;
export const exampleOutput = {
  expectedLossByHazard: [10, 40],
  aboveCallerRiskReviewFlags: [0, 1],
  sumOfDeclaredExpectedLosses: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/preservation-risk-score-calculator",
  title: "Preservation Risk Score Likelihood x Impact Calculator",
  description:
    "Compute caller calibrated marginal expected losses and review flags; summed losses assume compatible additive outcomes and do not combine event probabilities or establish preservation safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedLossByHazard",
      label: "Expected loss by hazard",
      kind: "numberList",
    },
    {
      id: "aboveCallerRiskReviewFlags",
      label: "Above caller risk review flags",
      kind: "numberList",
    },
    {
      id: "sumOfDeclaredExpectedLosses",
      label: "Sum of declared expected losses",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerHazardProbabilities:
        value.callerHazardProbabilities as readonly number[],
      callerLossValuesIfHazardOccurs:
        value.callerLossValuesIfHazardOccurs as readonly number[],
      callerRiskReviewThreshold: value.callerRiskReviewThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
