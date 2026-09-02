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
  readonly callerVerifiedWorkerDevelopmentDaysKeys: readonly string[];
  readonly callerVerifiedWorkerDevelopmentDaysValues: readonly number[];
  readonly queryWorkerDevelopmentDaysKey: string;
  readonly observedWorkerDevelopmentDaysValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedWorkerDevelopmentDaysKeys",
    label: "Caller verified worker development days keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedWorkerDevelopmentDaysValues",
    label: "Caller verified worker development days values",
    kind: "numberList",
  },
  {
    id: "queryWorkerDevelopmentDaysKey",
    label: "Query worker development days key",
    kind: "string",
  },
  {
    id: "observedWorkerDevelopmentDaysValue",
    label: "Observed worker development days value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedWorkerDevelopmentDaysValues.forEach((v) =>
    nonnegative(v, "verified physical reference"),
  );
  nonnegative(
    input.observedWorkerDevelopmentDaysValue,
    "observed physical value",
  );
  aligned(
    input.callerVerifiedWorkerDevelopmentDaysKeys,
    input.callerVerifiedWorkerDevelopmentDaysValues,
    "callerVerifiedWorkerDevelopmentDaysKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedWorkerDevelopmentDaysKeys,
    input.queryWorkerDevelopmentDaysKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedWorkerDevelopmentDaysValues[i],
    signedObservedMinusReference:
      input.observedWorkerDevelopmentDaysValue -
      input.callerVerifiedWorkerDevelopmentDaysValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedWorkerDevelopmentDaysKeys: ["a", "b"],
  callerVerifiedWorkerDevelopmentDaysValues: [2, 4],
  queryWorkerDevelopmentDaysKey: "b",
  observedWorkerDevelopmentDaysValue: 5,
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
  id: "apiculture/brood-cycle-worker-days-lookup",
  title: "Brood Cycle Worker Days Lookup",
  description:
    "Caller independently verified worker strain/temperature/protocol brood-development reference days. Exact independently matched reference; signed deviations retained. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedWorkerDevelopmentDaysKeys:
        value.callerVerifiedWorkerDevelopmentDaysKeys as readonly string[],
      callerVerifiedWorkerDevelopmentDaysValues:
        value.callerVerifiedWorkerDevelopmentDaysValues as readonly number[],
      queryWorkerDevelopmentDaysKey:
        value.queryWorkerDevelopmentDaysKey as string,
      observedWorkerDevelopmentDaysValue:
        value.observedWorkerDevelopmentDaysValue as number,
    }),
});
export const run = tool.execute;
export default tool;
