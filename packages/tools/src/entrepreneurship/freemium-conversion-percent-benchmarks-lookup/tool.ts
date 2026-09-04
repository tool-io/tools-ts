import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFreemiumConversionKeys: readonly string[];
  readonly callerVerifiedFreemiumConversionValues: readonly number[];
  readonly queryFreemiumConversionKey: string;
  readonly observedFreemiumConversionValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedFreemiumConversionKeys",
    label: "Caller verified freemium conversion keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFreemiumConversionValues",
    label: "Caller verified freemium conversion values",
    kind: "numberList",
  },
  {
    id: "queryFreemiumConversionKey",
    label: "Query freemium conversion key",
    kind: "string",
  },
  {
    id: "observedFreemiumConversionValue",
    label: "Observed freemium conversion value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedFreemiumConversionKeys,
    input.callerVerifiedFreemiumConversionValues,
    "callerVerifiedFreemiumConversionKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedFreemiumConversionKeys,
    input.queryFreemiumConversionKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedFreemiumConversionValues[i],
    signedObservedMinusReference:
      input.observedFreemiumConversionValue -
      input.callerVerifiedFreemiumConversionValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFreemiumConversionKeys: ["a", "b"],
  callerVerifiedFreemiumConversionValues: [2, 4],
  queryFreemiumConversionKey: "b",
  observedFreemiumConversionValue: 5,
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
  id: "entrepreneurship/freemium-conversion-percent-benchmarks-lookup",
  title: "Freemium Conversion Percent Benchmarks Lookup",
  description:
    "Actual same-cohort/window freemium paid conversion vs caller independently comparable reference. Exact independently matched reference; signed deviations retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedFreemiumConversionKeys:
        value.callerVerifiedFreemiumConversionKeys as readonly string[],
      callerVerifiedFreemiumConversionValues:
        value.callerVerifiedFreemiumConversionValues as readonly number[],
      queryFreemiumConversionKey: value.queryFreemiumConversionKey as string,
      observedFreemiumConversionValue:
        value.observedFreemiumConversionValue as number,
    }),
});
export const run = tool.execute;
export default tool;
