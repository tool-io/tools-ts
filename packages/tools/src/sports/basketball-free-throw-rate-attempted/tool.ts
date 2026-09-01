import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedFreeThrowAttempts: readonly number[];
  readonly observedFieldGoalAttempts: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedFreeThrowAttemptRates: readonly number[];
  readonly pooledFreeThrowAttemptRate: number;
}>;
const inputFields = [
  {
    id: "observedFreeThrowAttempts",
    label: "Observed free throw attempts",
    kind: "numberList",
  },
  {
    id: "observedFieldGoalAttempts",
    label: "Observed field goal attempts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedFreeThrowAttempts,
    input.observedFieldGoalAttempts,
    "games",
  );
  input.observedFreeThrowAttempts.forEach((v) => bounded(v, "ft", 0, 1000000));
  input.observedFieldGoalAttempts.forEach((v) => bounded(v, "fga", 1, 1000000));
  return {
    observedFreeThrowAttemptRates: input.observedFreeThrowAttempts.map(
      (v, i) => v / input.observedFieldGoalAttempts[i],
    ),
    pooledFreeThrowAttemptRate:
      sum(input.observedFreeThrowAttempts) /
      sum(input.observedFieldGoalAttempts),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFreeThrowAttempts: [10, 20],
  observedFieldGoalAttempts: [20, 20],
} satisfies Input;
export const exampleOutput = {
  observedFreeThrowAttemptRates: [0.5, 1],
  pooledFreeThrowAttemptRate: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/basketball-free-throw-rate-attempted",
  title: "Free Throw Rate Attempted Calculator",
  description:
    "Compute actual basketball FTA/FGA rates, preserving ratios above one; made-FT/FGA convention explicitly excluded, distinct from true shooting.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedFreeThrowAttemptRates",
      label: "Observed free throw attempt rates",
      kind: "numberList",
    },
    {
      id: "pooledFreeThrowAttemptRate",
      label: "Pooled free throw attempt rate",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFreeThrowAttempts:
        value.observedFreeThrowAttempts as readonly number[],
      observedFieldGoalAttempts:
        value.observedFieldGoalAttempts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
