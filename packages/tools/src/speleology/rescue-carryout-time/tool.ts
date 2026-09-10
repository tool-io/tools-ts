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
  readonly callerQualifiedCarrySegmentMinutes: readonly number[];
  readonly callerQualifiedTransferMinutes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerQualifiedCarrySegmentMinutes",
    label: "Caller qualified carry segment minutes",
    kind: "numberList",
  },
  {
    id: "callerQualifiedTransferMinutes",
    label: "Caller qualified transfer minutes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.callerQualifiedCarrySegmentMinutes,
    input.callerQualifiedTransferMinutes,
  ].forEach((v) => {
    if (!v.length) simpleError("inventory", "Actual explicit durations.");
    v.forEach((x) => nonnegative(x, "minutes"));
  });
  return {
    conditionalInventoryDurationMinutes:
      sum(input.callerQualifiedCarrySegmentMinutes) +
      sum(input.callerQualifiedTransferMinutes),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerQualifiedCarrySegmentMinutes: [2, 3],
    callerQualifiedTransferMinutes: [1, 2],
  },
  output: { result: { conditionalInventoryDurationMinutes: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/rescue-carryout-time",
  title: "Cave Rescue Carry Out Time Estimate Calculator",
  description:
    "Conditional qualified rescue actual carry and transfer duration inventory. Each compatible independently established component required; not automatic cave difficulty, medical rescue success or safe time prediction.",
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
