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
  readonly callerVerifiedDflEggReferenceKeys: readonly string[];
  readonly callerVerifiedDflEggReferenceValues: readonly number[];
  readonly queryDflEggReferenceKey: string;
  readonly observedDflEggReferenceValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedDflEggReferenceKeys",
    label: "Caller verified dfl egg reference keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedDflEggReferenceValues",
    label: "Caller verified dfl egg reference values",
    kind: "numberList",
  },
  {
    id: "queryDflEggReferenceKey",
    label: "Query dfl egg reference key",
    kind: "string",
  },
  {
    id: "observedDflEggReferenceValue",
    label: "Observed dfl egg reference value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedDflEggReferenceValues.forEach((v) =>
    nonnegative(v, "verified physical reference"),
  );
  nonnegative(input.observedDflEggReferenceValue, "observed physical value");
  aligned(
    input.callerVerifiedDflEggReferenceKeys,
    input.callerVerifiedDflEggReferenceValues,
    "callerVerifiedDflEggReferenceKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedDflEggReferenceKeys,
    input.queryDflEggReferenceKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedDflEggReferenceValues[i],
    signedObservedMinusReference:
      input.observedDflEggReferenceValue -
      input.callerVerifiedDflEggReferenceValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedDflEggReferenceKeys: ["a", "b"],
  callerVerifiedDflEggReferenceValues: [2, 4],
  queryDflEggReferenceKey: "b",
  observedDflEggReferenceValue: 5,
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
  id: "sericulture/dfl-eggs-standard-lookup",
  title: "DFL Eggs Standard Lookup",
  description:
    "Independently verified strain/grainage/DFL definition egg-count reference, DFL label not disease-free proof. Exact independently matched reference; signed deviations retained. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
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
      callerVerifiedDflEggReferenceKeys:
        value.callerVerifiedDflEggReferenceKeys as readonly string[],
      callerVerifiedDflEggReferenceValues:
        value.callerVerifiedDflEggReferenceValues as readonly number[],
      queryDflEggReferenceKey: value.queryDflEggReferenceKey as string,
      observedDflEggReferenceValue:
        value.observedDflEggReferenceValue as number,
    }),
});
export const run = tool.execute;
export default tool;
