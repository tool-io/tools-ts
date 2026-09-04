import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPreorderConversionKeys: readonly string[];
  readonly callerVerifiedPreorderConversionValues: readonly number[];
  readonly queryPreorderConversionKey: string;
  readonly observedPreorderConversionValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedPreorderConversionKeys",
    label: "Caller verified preorder conversion keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPreorderConversionValues",
    label: "Caller verified preorder conversion values",
    kind: "numberList",
  },
  {
    id: "queryPreorderConversionKey",
    label: "Query preorder conversion key",
    kind: "string",
  },
  {
    id: "observedPreorderConversionValue",
    label: "Observed preorder conversion value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedPreorderConversionKeys,
    input.callerVerifiedPreorderConversionValues,
    "callerVerifiedPreorderConversionKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedPreorderConversionKeys,
    input.queryPreorderConversionKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedPreorderConversionValues[i],
    signedObservedMinusReference:
      input.observedPreorderConversionValue -
      input.callerVerifiedPreorderConversionValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPreorderConversionKeys: ["a", "b"],
  callerVerifiedPreorderConversionValues: [2, 4],
  queryPreorderConversionKey: "b",
  observedPreorderConversionValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerReferenceValue: 4,
  signedObservedMinusReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/smoke-test-pre-order-conversion-benchmark-lookup",
  title: "Smoke Test Pre Order Conversion Benchmark Lookup",
  description:
    "Observed independently defined disclosed preorder conversion vs caller matched audience/offer benchmark; no success threshold invented. Exact independently matched reference; signed deviations retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerReferenceValue",
      label: "Caller reference value",
      kind: "number",
    },
    {
      id: "signedObservedMinusReference",
      label: "Signed observed minus reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedPreorderConversionKeys:
        value.callerVerifiedPreorderConversionKeys as readonly string[],
      callerVerifiedPreorderConversionValues:
        value.callerVerifiedPreorderConversionValues as readonly number[],
      queryPreorderConversionKey: value.queryPreorderConversionKey as string,
      observedPreorderConversionValue:
        value.observedPreorderConversionValue as number,
    }),
});
export const run = tool.execute;
export default tool;
