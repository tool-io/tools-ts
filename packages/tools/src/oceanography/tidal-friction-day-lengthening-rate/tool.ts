import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerDayLengtheningIds: readonly string[];
  readonly callerDayLengtheningValues: readonly number[];
  readonly queryDayLengtheningId: string;
  readonly observedDayLengtheningValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerDayLengtheningIds",
    label: "Caller day lengthening ids",
    kind: "stringList",
  },
  {
    id: "callerDayLengtheningValues",
    label: "Caller day lengthening values",
    kind: "numberList",
  },
  {
    id: "queryDayLengtheningId",
    label: "Query day lengthening id",
    kind: "string",
  },
  {
    id: "observedDayLengtheningValue",
    label: "Observed day lengthening value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerDayLengtheningIds,
    input.callerDayLengtheningValues,
    "callerDayLengtheningIds",
  );
  const i = catalogIndex(
    input.callerDayLengtheningIds,
    input.queryDayLengtheningId,
  );
  return {
    callerMatchedReferenceValue: input.callerDayLengtheningValues[i],
    signedObservedMinusReference:
      input.observedDayLengtheningValue - input.callerDayLengtheningValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDayLengtheningIds: ["a", "b"],
  callerDayLengtheningValues: [2, 4],
  queryDayLengtheningId: "b",
  observedDayLengtheningValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedReferenceValue: 4,
  signedObservedMinusReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/tidal-friction-day-lengthening-rate",
  title: "Tidal Friction Day Lengthening Rate Lookup",
  description:
    "Audit observed day-lengthening against caller independently verified epoch/method tidal-friction reference; no extrapolated rotation forecast. Independently verified caller edition/site/specimen reference, no fabricated table. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedReferenceValue",
      label: "Caller matched reference value",
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
      callerDayLengtheningIds:
        value.callerDayLengtheningIds as readonly string[],
      callerDayLengtheningValues:
        value.callerDayLengtheningValues as readonly number[],
      queryDayLengtheningId: value.queryDayLengtheningId as string,
      observedDayLengtheningValue: value.observedDayLengtheningValue as number,
    }),
});
export const run = tool.execute;
export default tool;
