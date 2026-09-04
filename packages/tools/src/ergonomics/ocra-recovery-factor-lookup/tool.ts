import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedOcraRecoveryScheduleKeys: readonly string[];
  readonly callerVerifiedOcraRecoveryScheduleValues: readonly number[];
  readonly queryOcraRecoveryScheduleKey: string;
  readonly observedOcraRecoveryScheduleValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedOcraRecoveryScheduleKeys",
    label: "Caller verified ocra recovery schedule keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedOcraRecoveryScheduleValues",
    label: "Caller verified ocra recovery schedule values",
    kind: "numberList",
  },
  {
    id: "queryOcraRecoveryScheduleKey",
    label: "Query ocra recovery schedule key",
    kind: "string",
  },
  {
    id: "observedOcraRecoveryScheduleValue",
    label: "Observed ocra recovery schedule value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedOcraRecoveryScheduleKeys,
    input.callerVerifiedOcraRecoveryScheduleValues,
    "callerVerifiedOcraRecoveryScheduleKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedOcraRecoveryScheduleKeys,
    input.queryOcraRecoveryScheduleKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedOcraRecoveryScheduleValues[i],
    signedObservedMinusReference:
      input.observedOcraRecoveryScheduleValue -
      input.callerVerifiedOcraRecoveryScheduleValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedOcraRecoveryScheduleKeys: ["a", "b"],
  callerVerifiedOcraRecoveryScheduleValues: [2, 4],
  queryOcraRecoveryScheduleKey: "b",
  observedOcraRecoveryScheduleValue: 5,
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
  id: "ergonomics/ocra-recovery-factor-lookup",
  title: "OCRA Recovery Period Factor Lookup",
  description:
    "OCRA recovery factor exact caller independently verified recovery-spacing/duration/task-time reference; no factor from total rest minutes alone. Exact caller verified numeric reference; signed deviations retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedOcraRecoveryScheduleKeys:
        value.callerVerifiedOcraRecoveryScheduleKeys as readonly string[],
      callerVerifiedOcraRecoveryScheduleValues:
        value.callerVerifiedOcraRecoveryScheduleValues as readonly number[],
      queryOcraRecoveryScheduleKey:
        value.queryOcraRecoveryScheduleKey as string,
      observedOcraRecoveryScheduleValue:
        value.observedOcraRecoveryScheduleValue as number,
    }),
});
export const run = tool.execute;
export default tool;
