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
  readonly callerVerifiedBoxFrameSlotsKeys: readonly string[];
  readonly callerVerifiedBoxFrameSlotsValues: readonly number[];
  readonly queryBoxFrameSlotsKey: string;
  readonly observedBoxFrameSlotsValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedBoxFrameSlotsKeys",
    label: "Caller verified box frame slots keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedBoxFrameSlotsValues",
    label: "Caller verified box frame slots values",
    kind: "numberList",
  },
  {
    id: "queryBoxFrameSlotsKey",
    label: "Query box frame slots key",
    kind: "string",
  },
  {
    id: "observedBoxFrameSlotsValue",
    label: "Observed box frame slots value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedBoxFrameSlotsValues.forEach((v) =>
    nonnegative(v, "verified physical reference"),
  );
  nonnegative(input.observedBoxFrameSlotsValue, "observed physical value");
  aligned(
    input.callerVerifiedBoxFrameSlotsKeys,
    input.callerVerifiedBoxFrameSlotsValues,
    "callerVerifiedBoxFrameSlotsKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedBoxFrameSlotsKeys,
    input.queryBoxFrameSlotsKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedBoxFrameSlotsValues[i],
    signedObservedMinusReference:
      input.observedBoxFrameSlotsValue -
      input.callerVerifiedBoxFrameSlotsValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedBoxFrameSlotsKeys: ["a", "b"],
  callerVerifiedBoxFrameSlotsValues: [2, 4],
  queryBoxFrameSlotsKey: "b",
  observedBoxFrameSlotsValue: 5,
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
  id: "apiculture/frames-per-box-standard-count-lookup",
  title: "Frames Per Box Standard Count Lookup",
  description:
    "Caller exact manufacturer/model frame-slot reference; spacing/layout independently established. Exact independently matched reference; signed deviations retained. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedBoxFrameSlotsKeys:
        value.callerVerifiedBoxFrameSlotsKeys as readonly string[],
      callerVerifiedBoxFrameSlotsValues:
        value.callerVerifiedBoxFrameSlotsValues as readonly number[],
      queryBoxFrameSlotsKey: value.queryBoxFrameSlotsKey as string,
      observedBoxFrameSlotsValue: value.observedBoxFrameSlotsValue as number,
    }),
});
export const run = tool.execute;
export default tool;
