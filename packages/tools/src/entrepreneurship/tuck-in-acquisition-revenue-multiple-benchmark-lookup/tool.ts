import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAcquisitionRevenueMultipleKeys: readonly string[];
  readonly callerVerifiedAcquisitionRevenueMultipleValues: readonly number[];
  readonly queryAcquisitionRevenueMultipleKey: string;
  readonly observedAcquisitionRevenueMultipleValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedAcquisitionRevenueMultipleKeys",
    label: "Caller verified acquisition revenue multiple keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAcquisitionRevenueMultipleValues",
    label: "Caller verified acquisition revenue multiple values",
    kind: "numberList",
  },
  {
    id: "queryAcquisitionRevenueMultipleKey",
    label: "Query acquisition revenue multiple key",
    kind: "string",
  },
  {
    id: "observedAcquisitionRevenueMultipleValue",
    label: "Observed acquisition revenue multiple value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedAcquisitionRevenueMultipleKeys,
    input.callerVerifiedAcquisitionRevenueMultipleValues,
    "callerVerifiedAcquisitionRevenueMultipleKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedAcquisitionRevenueMultipleKeys,
    input.queryAcquisitionRevenueMultipleKey,
  );
  return {
    callerReferenceValue:
      input.callerVerifiedAcquisitionRevenueMultipleValues[i],
    signedObservedMinusReference:
      input.observedAcquisitionRevenueMultipleValue -
      input.callerVerifiedAcquisitionRevenueMultipleValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAcquisitionRevenueMultipleKeys: ["a", "b"],
  callerVerifiedAcquisitionRevenueMultipleValues: [2, 4],
  queryAcquisitionRevenueMultipleKey: "b",
  observedAcquisitionRevenueMultipleValue: 5,
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
  id: "entrepreneurship/tuck-in-acquisition-revenue-multiple-benchmark-lookup",
  title: "Tuck in Acquisition Revenue Multiple Benchmark Lookup",
  description:
    "Observed independently measured acquisition price/trailing-or-forward-revenue multiple vs matched caller benchmark. Exact independently matched reference; signed deviations retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedAcquisitionRevenueMultipleKeys:
        value.callerVerifiedAcquisitionRevenueMultipleKeys as readonly string[],
      callerVerifiedAcquisitionRevenueMultipleValues:
        value.callerVerifiedAcquisitionRevenueMultipleValues as readonly number[],
      queryAcquisitionRevenueMultipleKey:
        value.queryAcquisitionRevenueMultipleKey as string,
      observedAcquisitionRevenueMultipleValue:
        value.observedAcquisitionRevenueMultipleValue as number,
    }),
});
export const run = tool.execute;
export default tool;
