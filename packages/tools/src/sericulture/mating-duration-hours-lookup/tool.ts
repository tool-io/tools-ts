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
  readonly callerVerifiedObservedMatingDurationHoursKeys: readonly string[];
  readonly callerVerifiedObservedMatingDurationHoursValues: readonly number[];
  readonly queryObservedMatingDurationHoursKey: string;
  readonly observedObservedMatingDurationHoursValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedObservedMatingDurationHoursKeys",
    label: "Caller verified observed mating duration hours keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedObservedMatingDurationHoursValues",
    label: "Caller verified observed mating duration hours values",
    kind: "numberList",
  },
  {
    id: "queryObservedMatingDurationHoursKey",
    label: "Query observed mating duration hours key",
    kind: "string",
  },
  {
    id: "observedObservedMatingDurationHoursValue",
    label: "Observed observed mating duration hours value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedObservedMatingDurationHoursValues.forEach((v) =>
    nonnegative(v, "verified physical reference"),
  );
  nonnegative(
    input.observedObservedMatingDurationHoursValue,
    "observed physical value",
  );
  aligned(
    input.callerVerifiedObservedMatingDurationHoursKeys,
    input.callerVerifiedObservedMatingDurationHoursValues,
    "callerVerifiedObservedMatingDurationHoursKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedObservedMatingDurationHoursKeys,
    input.queryObservedMatingDurationHoursKey,
  );
  return {
    callerReferenceValue:
      input.callerVerifiedObservedMatingDurationHoursValues[i],
    signedObservedMinusReference:
      input.observedObservedMatingDurationHoursValue -
      input.callerVerifiedObservedMatingDurationHoursValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedObservedMatingDurationHoursKeys: ["a", "b"],
  callerVerifiedObservedMatingDurationHoursValues: [2, 4],
  queryObservedMatingDurationHoursKey: "b",
  observedObservedMatingDurationHoursValue: 5,
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
  id: "sericulture/mating-duration-hours-lookup",
  title: "Mating Duration Hours Lookup",
  description:
    "Actual independently observed silkmoth strain/protocol mating duration vs same-method reference. Exact independently matched reference; signed deviations retained. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
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
      callerVerifiedObservedMatingDurationHoursKeys:
        value.callerVerifiedObservedMatingDurationHoursKeys as readonly string[],
      callerVerifiedObservedMatingDurationHoursValues:
        value.callerVerifiedObservedMatingDurationHoursValues as readonly number[],
      queryObservedMatingDurationHoursKey:
        value.queryObservedMatingDurationHoursKey as string,
      observedObservedMatingDurationHoursValue:
        value.observedObservedMatingDurationHoursValue as number,
    }),
});
export const run = tool.execute;
export default tool;
