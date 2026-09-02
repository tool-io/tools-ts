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
  readonly callerVerifiedDroneDevelopmentDaysKeys: readonly string[];
  readonly callerVerifiedDroneDevelopmentDaysValues: readonly number[];
  readonly queryDroneDevelopmentDaysKey: string;
  readonly observedDroneDevelopmentDaysValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedDroneDevelopmentDaysKeys",
    label: "Caller verified drone development days keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedDroneDevelopmentDaysValues",
    label: "Caller verified drone development days values",
    kind: "numberList",
  },
  {
    id: "queryDroneDevelopmentDaysKey",
    label: "Query drone development days key",
    kind: "string",
  },
  {
    id: "observedDroneDevelopmentDaysValue",
    label: "Observed drone development days value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedDroneDevelopmentDaysValues.forEach((v) =>
    nonnegative(v, "verified physical reference"),
  );
  nonnegative(
    input.observedDroneDevelopmentDaysValue,
    "observed physical value",
  );
  aligned(
    input.callerVerifiedDroneDevelopmentDaysKeys,
    input.callerVerifiedDroneDevelopmentDaysValues,
    "callerVerifiedDroneDevelopmentDaysKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedDroneDevelopmentDaysKeys,
    input.queryDroneDevelopmentDaysKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedDroneDevelopmentDaysValues[i],
    signedObservedMinusReference:
      input.observedDroneDevelopmentDaysValue -
      input.callerVerifiedDroneDevelopmentDaysValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedDroneDevelopmentDaysKeys: ["a", "b"],
  callerVerifiedDroneDevelopmentDaysValues: [2, 4],
  queryDroneDevelopmentDaysKey: "b",
  observedDroneDevelopmentDaysValue: 5,
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
  id: "apiculture/brood-cycle-drone-days-lookup",
  title: "Brood Cycle Drone Days Lookup",
  description:
    "Caller independently verified drone strain/temperature/protocol brood-development reference days. Exact independently matched reference; signed deviations retained. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedDroneDevelopmentDaysKeys:
        value.callerVerifiedDroneDevelopmentDaysKeys as readonly string[],
      callerVerifiedDroneDevelopmentDaysValues:
        value.callerVerifiedDroneDevelopmentDaysValues as readonly number[],
      queryDroneDevelopmentDaysKey:
        value.queryDroneDevelopmentDaysKey as string,
      observedDroneDevelopmentDaysValue:
        value.observedDroneDevelopmentDaysValue as number,
    }),
});
export const run = tool.execute;
export default tool;
