import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndifferenceGainMagnitude: number;
  readonly actualIndifferenceLossMagnitude: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndifferenceGainMagnitude",
    label: "Actual indifference gain magnitude",
    kind: "number",
  },
  {
    id: "actualIndifferenceLossMagnitude",
    label: "Actual indifference loss magnitude",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualIndifferenceGainMagnitude,
    "actualIndifferenceGainMagnitude",
  );
  positive(
    input.actualIndifferenceLossMagnitude,
    "actualIndifferenceLossMagnitude",
  );
  return {
    value:
      input.actualIndifferenceGainMagnitude /
      input.actualIndifferenceLossMagnitude,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndifferenceGainMagnitude: 4,
    actualIndifferenceLossMagnitude: 2,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/loss-aversion-lambda-estimate",
  title: "Loss Aversion Lambda Estimate",
  description:
    "Restricted linear prospect utility gain/loss indifference\u03bb=G/L, zero reference/endowment and independently actual indifference. Curved utilities require separate exponents; not universal loss aversion. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
