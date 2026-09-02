import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  catalogIndex,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedWinterStoreTargetKeys: readonly string[];
  readonly callerVerifiedWinterStoreTargetValues: readonly number[];
  readonly queryWinterStoreTargetKey: string;
  readonly observedWinterStoreTargetValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedWinterStoreTargetKeys",
    label: "Caller verified winter store target keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedWinterStoreTargetValues",
    label: "Caller verified winter store target values",
    kind: "numberList",
  },
  {
    id: "queryWinterStoreTargetKey",
    label: "Query winter store target key",
    kind: "string",
  },
  {
    id: "observedWinterStoreTargetValue",
    label: "Observed winter store target value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedWinterStoreTargetValues.forEach((v) =>
    nonnegative(v, "verified physical reference"),
  );
  nonnegative(input.observedWinterStoreTargetValue, "observed physical value");
  aligned(
    input.callerVerifiedWinterStoreTargetKeys,
    input.callerVerifiedWinterStoreTargetValues,
    "callerVerifiedWinterStoreTargetKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedWinterStoreTargetKeys,
    input.queryWinterStoreTargetKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedWinterStoreTargetValues[i],
    signedObservedMinusReference:
      input.observedWinterStoreTargetValue -
      input.callerVerifiedWinterStoreTargetValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedWinterStoreTargetKeys: ["a", "b"],
  callerVerifiedWinterStoreTargetValues: [2, 4],
  queryWinterStoreTargetKey: "b",
  observedWinterStoreTargetValue: 5,
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
  id: "apiculture/winter-stores-pounds-required-region-lookup",
  title: "Winter Stores Pounds Required Region Lookup",
  description:
    "Caller independently verified region/strain/management winter store target reference, not weather/feed survival guarantee. Exact independently matched reference; signed deviations retained. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedWinterStoreTargetKeys:
        value.callerVerifiedWinterStoreTargetKeys as readonly string[],
      callerVerifiedWinterStoreTargetValues:
        value.callerVerifiedWinterStoreTargetValues as readonly number[],
      queryWinterStoreTargetKey: value.queryWinterStoreTargetKey as string,
      observedWinterStoreTargetValue:
        value.observedWinterStoreTargetValue as number,
    }),
});
export const run = tool.execute;
export default tool;
