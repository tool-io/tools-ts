import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualDelayedReward: number;
  readonly actualImmediateIndifferenceReward: number;
  readonly actualDelay: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualDelayedReward", label: "Actual delayed reward", kind: "number" },
  {
    id: "actualImmediateIndifferenceReward",
    label: "Actual immediate indifference reward",
    kind: "number",
  },
  { id: "actualDelay", label: "Actual delay", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualDelayedReward, "actualDelayedReward");
  positive(
    input.actualImmediateIndifferenceReward,
    "actualImmediateIndifferenceReward",
  );
  positive(input.actualDelay, "actualDelay");
  return {
    value:
      (input.actualDelayedReward / input.actualImmediateIndifferenceReward -
        1) /
      input.actualDelay,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDelayedReward: 2,
    actualImmediateIndifferenceReward: 1,
    actualDelay: 2,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/temporal-discounting-hyperbolic-k",
  title: "Hyperbolic Temporal Discounting k Estimator",
  description:
    "HyperbolicV=A/(1+kD) single indifference k=(A/V\u22121)/D, actual positive delay; negativek retained, not full behavioral calibration. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
