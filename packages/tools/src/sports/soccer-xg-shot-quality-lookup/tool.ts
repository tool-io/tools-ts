import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  sum,
  catalogIndex,
  probability,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerShotContextIds: readonly string[];
  readonly callerCalibratedShotGoalProbabilities: readonly number[];
  readonly observedShotContextIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly callerShotExpectedGoals: readonly number[];
  readonly totalCallerExpectedGoals: number;
}>;
const inputFields = [
  {
    id: "callerShotContextIds",
    label: "Caller shot context ids",
    kind: "stringList",
  },
  {
    id: "callerCalibratedShotGoalProbabilities",
    label: "Caller calibrated shot goal probabilities",
    kind: "numberList",
  },
  {
    id: "observedShotContextIds",
    label: "Observed shot context ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerShotContextIds,
    input.callerCalibratedShotGoalProbabilities,
    "catalog",
  );
  unique(input.callerShotContextIds, "contexts");
  input.callerCalibratedShotGoalProbabilities.forEach((v) => probability(v));
  if (!input.observedShotContextIds.length)
    simpleError("shots", "Observed shot contexts required.");
  const values = input.observedShotContextIds.map(
    (v) =>
      input.callerCalibratedShotGoalProbabilities[
        catalogIndex(input.callerShotContextIds, v)
      ],
  );
  return {
    callerShotExpectedGoals: values,
    totalCallerExpectedGoals: sum(values),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerShotContextIds: ["a", "b"],
  callerCalibratedShotGoalProbabilities: [0.1, 0.4],
  observedShotContextIds: ["a", "b", "a"],
} satisfies Input;
export const exampleOutput = {
  callerShotExpectedGoals: [0.1, 0.4, 0.1],
  totalCallerExpectedGoals: 0.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/soccer-xg-shot-quality-lookup",
  title: "xG Shot Quality Lookup",
  description:
    "Map actual soccer shot contexts to caller independently calibrated goal probabilities and sum xG; no fabricated distance/angle model, independent-goal joint probability or scoring guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerShotExpectedGoals",
      label: "Caller shot expected goals",
      kind: "numberList",
    },
    {
      id: "totalCallerExpectedGoals",
      label: "Total caller expected goals",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerShotContextIds: value.callerShotContextIds as readonly string[],
      callerCalibratedShotGoalProbabilities:
        value.callerCalibratedShotGoalProbabilities as readonly number[],
      observedShotContextIds: value.observedShotContextIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
