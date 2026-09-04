import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTaskIlluminanceKeys: readonly string[];
  readonly callerVerifiedTaskIlluminanceValues: readonly number[];
  readonly queryTaskIlluminanceKey: string;
  readonly observedTaskIlluminanceValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedTaskIlluminanceKeys",
    label: "Caller verified task illuminance keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTaskIlluminanceValues",
    label: "Caller verified task illuminance values",
    kind: "numberList",
  },
  {
    id: "queryTaskIlluminanceKey",
    label: "Query task illuminance key",
    kind: "string",
  },
  {
    id: "observedTaskIlluminanceValue",
    label: "Observed task illuminance value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedTaskIlluminanceKeys,
    input.callerVerifiedTaskIlluminanceValues,
    "callerVerifiedTaskIlluminanceKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedTaskIlluminanceKeys,
    input.queryTaskIlluminanceKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedTaskIlluminanceValues[i],
    signedObservedMinusReference:
      input.observedTaskIlluminanceValue -
      input.callerVerifiedTaskIlluminanceValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTaskIlluminanceKeys: ["a", "b"],
  callerVerifiedTaskIlluminanceValues: [2, 4],
  queryTaskIlluminanceKey: "b",
  observedTaskIlluminanceValue: 5,
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
  id: "ergonomics/task-lighting-lux-lookup",
  title: "Task Lighting Lux Requirement Lookup by Task Type",
  description:
    "Measured task illuminance vs caller verified task/age/contrast reference lux, not live lighting standard or recommended generic task list. Exact caller verified numeric reference; signed deviations retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedTaskIlluminanceKeys:
        value.callerVerifiedTaskIlluminanceKeys as readonly string[],
      callerVerifiedTaskIlluminanceValues:
        value.callerVerifiedTaskIlluminanceValues as readonly number[],
      queryTaskIlluminanceKey: value.queryTaskIlluminanceKey as string,
      observedTaskIlluminanceValue:
        value.observedTaskIlluminanceValue as number,
    }),
});
export const run = tool.execute;
export default tool;
