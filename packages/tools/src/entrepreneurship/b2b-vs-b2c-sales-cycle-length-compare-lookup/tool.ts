import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  median,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerMatchedB2bObservedCycleDays: readonly number[];
  readonly callerMatchedB2cObservedCycleDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly b2bMedianCycleDays: number;
  readonly b2cMedianCycleDays: number;
  readonly signedMedianCycleDifferenceDays: number;
}>;
const inputFields = [
  {
    id: "callerMatchedB2bObservedCycleDays",
    label: "Caller matched b2b observed cycle days",
    kind: "numberList",
  },
  {
    id: "callerMatchedB2cObservedCycleDays",
    label: "Caller matched b2c observed cycle days",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedB2bObservedCycleDays.forEach((v) =>
    nonnegative(v, "callerMatchedB2bObservedCycleDays"),
  );
  input.callerMatchedB2cObservedCycleDays.forEach((v) =>
    nonnegative(v, "callerMatchedB2cObservedCycleDays"),
  );
  const a = median(input.callerMatchedB2bObservedCycleDays),
    b = median(input.callerMatchedB2cObservedCycleDays);
  return {
    b2bMedianCycleDays: a,
    b2cMedianCycleDays: b,
    signedMedianCycleDifferenceDays: a - b,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedB2bObservedCycleDays: [10, 20],
  callerMatchedB2cObservedCycleDays: [1, 3],
} satisfies Input;
export const exampleOutput = {
  b2bMedianCycleDays: 15,
  b2cMedianCycleDays: 2,
  signedMedianCycleDifferenceDays: 13,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/b2b-vs-b2c-sales-cycle-length-compare-lookup",
  title: "B2b vs B2c Sales Cycle Length Compare Lookup",
  description:
    "Actual independently definition-matched B2B/B2Cclosed sales-cycle samples; unclosed/censored deals excluded explicitly, not universal enterprise/consumer benchmark. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "b2bMedianCycleDays",
      label: "B2b median cycle days",
      kind: "number",
    },
    {
      id: "b2cMedianCycleDays",
      label: "B2c median cycle days",
      kind: "number",
    },
    {
      id: "signedMedianCycleDifferenceDays",
      label: "Signed median cycle difference days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedB2bObservedCycleDays:
        value.callerMatchedB2bObservedCycleDays as readonly number[],
      callerMatchedB2cObservedCycleDays:
        value.callerMatchedB2cObservedCycleDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
