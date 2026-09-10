import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyEstablishedTravelMinutes: readonly number[];
  readonly callerIndependentlyEstablishedRestMinutes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyEstablishedTravelMinutes",
    label: "Caller independently established travel minutes",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEstablishedRestMinutes",
    label: "Caller independently established rest minutes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.callerIndependentlyEstablishedTravelMinutes,
    input.callerIndependentlyEstablishedRestMinutes,
  ].forEach((v) => {
    if (!v.length) simpleError("inventory", "Actual explicit durations.");
    v.forEach((x) => nonnegative(x, "minutes"));
  });
  return {
    conditionalInventoryDurationMinutes:
      sum(input.callerIndependentlyEstablishedTravelMinutes) +
      sum(input.callerIndependentlyEstablishedRestMinutes),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyEstablishedTravelMinutes: [2, 3],
    callerIndependentlyEstablishedRestMinutes: [1, 2],
  },
  output: { result: { conditionalInventoryDurationMinutes: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/trip-duration-rest-stops",
  title: "Trip Duration Plan with Rest Stops Calculator",
  description:
    "Conditional planned disjoint travel/rest duration. Each compatible independently established component required; not automatic cave difficulty, medical rescue success or safe time prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
