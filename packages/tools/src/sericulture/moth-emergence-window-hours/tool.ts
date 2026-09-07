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
  readonly callerVerifiedMothEmergenceHourWindowKeys: readonly string[];
  readonly callerVerifiedMothEmergenceHourWindowValues: readonly number[];
  readonly queryMothEmergenceHourWindowKey: string;
  readonly observedMothEmergenceHourWindowValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedMothEmergenceHourWindowKeys",
    label: "Caller verified moth emergence hour window keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMothEmergenceHourWindowValues",
    label: "Caller verified moth emergence hour window values",
    kind: "numberList",
  },
  {
    id: "queryMothEmergenceHourWindowKey",
    label: "Query moth emergence hour window key",
    kind: "string",
  },
  {
    id: "observedMothEmergenceHourWindowValue",
    label: "Observed moth emergence hour window value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedMothEmergenceHourWindowValues.forEach((v) =>
    nonnegative(v, "verified physical reference"),
  );
  nonnegative(
    input.observedMothEmergenceHourWindowValue,
    "observed physical value",
  );
  aligned(
    input.callerVerifiedMothEmergenceHourWindowKeys,
    input.callerVerifiedMothEmergenceHourWindowValues,
    "callerVerifiedMothEmergenceHourWindowKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedMothEmergenceHourWindowKeys,
    input.queryMothEmergenceHourWindowKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedMothEmergenceHourWindowValues[i],
    signedObservedMinusReference:
      input.observedMothEmergenceHourWindowValue -
      input.callerVerifiedMothEmergenceHourWindowValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedMothEmergenceHourWindowKeys: ["a", "b"],
  callerVerifiedMothEmergenceHourWindowValues: [2, 4],
  queryMothEmergenceHourWindowKey: "b",
  observedMothEmergenceHourWindowValue: 5,
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
  id: "sericulture/moth-emergence-window-hours",
  title: "Moth Emergence Window Hours Lookup",
  description:
    "Caller independently matched strain/light-cycle/cohort emergence-hour window reference, not timezone/current-night prediction. Exact independently matched reference; signed deviations retained. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
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
      callerVerifiedMothEmergenceHourWindowKeys:
        value.callerVerifiedMothEmergenceHourWindowKeys as readonly string[],
      callerVerifiedMothEmergenceHourWindowValues:
        value.callerVerifiedMothEmergenceHourWindowValues as readonly number[],
      queryMothEmergenceHourWindowKey:
        value.queryMothEmergenceHourWindowKey as string,
      observedMothEmergenceHourWindowValue:
        value.observedMothEmergenceHourWindowValue as number,
    }),
});
export const run = tool.execute;
export default tool;
