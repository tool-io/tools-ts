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
  readonly callerIndependentlyEstablishedSegmentMinutes: readonly number[];
  readonly callerActualQueueMinutes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyEstablishedSegmentMinutes",
    label: "Caller independently established segment minutes",
    kind: "numberList",
  },
  {
    id: "callerActualQueueMinutes",
    label: "Caller actual queue minutes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.callerIndependentlyEstablishedSegmentMinutes,
    input.callerActualQueueMinutes,
  ].forEach((v) => {
    if (!v.length) simpleError("inventory", "Actual explicit durations.");
    v.forEach((x) => nonnegative(x, "minutes"));
  });
  return {
    conditionalInventoryDurationMinutes:
      sum(input.callerIndependentlyEstablishedSegmentMinutes) +
      sum(input.callerActualQueueMinutes),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyEstablishedSegmentMinutes: [2, 3],
    callerActualQueueMinutes: [1, 2],
  },
  output: { result: { conditionalInventoryDurationMinutes: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/through-trip-time-estimator",
  title: "Team Through-Trip Time Estimator",
  description:
    "Conditional through-trip segment and actual queue inventory. Each compatible independently established component required; not automatic cave difficulty, medical rescue success or safe time prediction.",
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
