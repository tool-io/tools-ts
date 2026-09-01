import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedGoalKickAttempts: readonly number[];
  readonly observedSuccessfulGoalKicks: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledGoalKickSuccessPercent: number;
}>;
const inputFields = [
  {
    id: "observedGoalKickAttempts",
    label: "Observed goal kick attempts",
    kind: "numberList",
  },
  {
    id: "observedSuccessfulGoalKicks",
    label: "Observed successful goal kicks",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedGoalKickAttempts,
    input.observedSuccessfulGoalKicks,
    "matches",
  );
  input.observedGoalKickAttempts.forEach((v) =>
    bounded(v, "attempts", 0, 1000000),
  );
  input.observedSuccessfulGoalKicks.forEach((v, i) =>
    bounded(v, "made", 0, input.observedGoalKickAttempts[i]),
  );
  positive(sum(input.observedGoalKickAttempts), "attempts");
  return {
    pooledGoalKickSuccessPercent:
      (100 * sum(input.observedSuccessfulGoalKicks)) /
      sum(input.observedGoalKickAttempts),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGoalKickAttempts: [5, 10],
  observedSuccessfulGoalKicks: [2, 6],
} satisfies Input;
export const exampleOutput = {
  pooledGoalKickSuccessPercent: 53.333333333333336,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/rugby-goal-kick-percent-success",
  title: "Rugby Goal Kick Success Percent",
  description:
    "Pool actual rugby goal kicks over matched opportunity counts, not unweighted match percentages or general success inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledGoalKickSuccessPercent",
      label: "Pooled goal kick success percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGoalKickAttempts:
        value.observedGoalKickAttempts as readonly number[],
      observedSuccessfulGoalKicks:
        value.observedSuccessfulGoalKicks as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
