import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedEyewallDurationHoursKeys: readonly string[];
  readonly callerVerifiedEyewallDurationHoursValues: readonly number[];
  readonly queryEyewallDurationHoursKey: string;
  readonly observedEyewallDurationHoursValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedEyewallDurationHoursKeys",
    label: "Caller verified eyewall duration hours keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedEyewallDurationHoursValues",
    label: "Caller verified eyewall duration hours values",
    kind: "numberList",
  },
  {
    id: "queryEyewallDurationHoursKey",
    label: "Query eyewall duration hours key",
    kind: "string",
  },
  {
    id: "observedEyewallDurationHoursValue",
    label: "Observed eyewall duration hours value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedEyewallDurationHoursKeys,
    input.callerVerifiedEyewallDurationHoursValues,
    "callerVerifiedEyewallDurationHoursKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedEyewallDurationHoursKeys,
    input.queryEyewallDurationHoursKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedEyewallDurationHoursValues[i],
    signedObservedMinusReference:
      input.observedEyewallDurationHoursValue -
      input.callerVerifiedEyewallDurationHoursValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedEyewallDurationHoursKeys: ["a", "b"],
  callerVerifiedEyewallDurationHoursValues: [2, 4],
  queryEyewallDurationHoursKey: "b",
  observedEyewallDurationHoursValue: 5,
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
  id: "meteorology/eyewall-replacement-cycle-duration-lookup",
  title: "Eyewall Replacement Cycle Duration Lookup",
  description:
    "Observed independently defined eyewall-cycle duration compared with caller matched storm-family reference, not predicted completion. Exact caller verified numeric reference; signed deviations retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedEyewallDurationHoursKeys:
        value.callerVerifiedEyewallDurationHoursKeys as readonly string[],
      callerVerifiedEyewallDurationHoursValues:
        value.callerVerifiedEyewallDurationHoursValues as readonly number[],
      queryEyewallDurationHoursKey:
        value.queryEyewallDurationHoursKey as string,
      observedEyewallDurationHoursValue:
        value.observedEyewallDurationHoursValue as number,
    }),
});
export const run = tool.execute;
export default tool;
