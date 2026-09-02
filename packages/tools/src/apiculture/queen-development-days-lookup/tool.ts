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
  readonly callerVerifiedQueenDevelopmentDaysKeys: readonly string[];
  readonly callerVerifiedQueenDevelopmentDaysValues: readonly number[];
  readonly queryQueenDevelopmentDaysKey: string;
  readonly observedQueenDevelopmentDaysValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedQueenDevelopmentDaysKeys",
    label: "Caller verified queen development days keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedQueenDevelopmentDaysValues",
    label: "Caller verified queen development days values",
    kind: "numberList",
  },
  {
    id: "queryQueenDevelopmentDaysKey",
    label: "Query queen development days key",
    kind: "string",
  },
  {
    id: "observedQueenDevelopmentDaysValue",
    label: "Observed queen development days value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedQueenDevelopmentDaysValues.forEach((v) =>
    nonnegative(v, "verified physical reference"),
  );
  nonnegative(
    input.observedQueenDevelopmentDaysValue,
    "observed physical value",
  );
  aligned(
    input.callerVerifiedQueenDevelopmentDaysKeys,
    input.callerVerifiedQueenDevelopmentDaysValues,
    "callerVerifiedQueenDevelopmentDaysKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedQueenDevelopmentDaysKeys,
    input.queryQueenDevelopmentDaysKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedQueenDevelopmentDaysValues[i],
    signedObservedMinusReference:
      input.observedQueenDevelopmentDaysValue -
      input.callerVerifiedQueenDevelopmentDaysValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedQueenDevelopmentDaysKeys: ["a", "b"],
  callerVerifiedQueenDevelopmentDaysValues: [2, 4],
  queryQueenDevelopmentDaysKey: "b",
  observedQueenDevelopmentDaysValue: 5,
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
  id: "apiculture/queen-development-days-lookup",
  title: "Queen Development Days Lookup",
  description:
    "Caller independently verified queen strain/temperature/protocol development reference days. Exact independently matched reference; signed deviations retained. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedQueenDevelopmentDaysKeys:
        value.callerVerifiedQueenDevelopmentDaysKeys as readonly string[],
      callerVerifiedQueenDevelopmentDaysValues:
        value.callerVerifiedQueenDevelopmentDaysValues as readonly number[],
      queryQueenDevelopmentDaysKey:
        value.queryQueenDevelopmentDaysKey as string,
      observedQueenDevelopmentDaysValue:
        value.observedQueenDevelopmentDaysValue as number,
    }),
});
export const run = tool.execute;
export default tool;
