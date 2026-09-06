import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerAccSectionTransportIds: readonly string[];
  readonly callerAccSectionTransportValues: readonly number[];
  readonly queryAccSectionTransportId: string;
  readonly observedAccSectionTransportValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerAccSectionTransportIds",
    label: "Caller acc section transport ids",
    kind: "stringList",
  },
  {
    id: "callerAccSectionTransportValues",
    label: "Caller acc section transport values",
    kind: "numberList",
  },
  {
    id: "queryAccSectionTransportId",
    label: "Query acc section transport id",
    kind: "string",
  },
  {
    id: "observedAccSectionTransportValue",
    label: "Observed acc section transport value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerAccSectionTransportIds,
    input.callerAccSectionTransportValues,
    "callerAccSectionTransportIds",
  );
  const i = catalogIndex(
    input.callerAccSectionTransportIds,
    input.queryAccSectionTransportId,
  );
  return {
    callerMatchedReferenceValue: input.callerAccSectionTransportValues[i],
    signedObservedMinusReference:
      input.observedAccSectionTransportValue -
      input.callerAccSectionTransportValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAccSectionTransportIds: ["a", "b"],
  callerAccSectionTransportValues: [2, 4],
  queryAccSectionTransportId: "b",
  observedAccSectionTransportValue: 5,
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
  id: "oceanography/antarctic-circumpolar-throughflow-lookup",
  title: "Antarctic Circumpolar Throughflow Reference Lookup",
  description:
    "Audit actual ACC section transport against independently verified same sector/depth/epoch reference, not global constant. Independently verified caller edition/site/specimen reference, no fabricated table. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      callerAccSectionTransportIds:
        value.callerAccSectionTransportIds as readonly string[],
      callerAccSectionTransportValues:
        value.callerAccSectionTransportValues as readonly number[],
      queryAccSectionTransportId: value.queryAccSectionTransportId as string,
      observedAccSectionTransportValue:
        value.observedAccSectionTransportValue as number,
    }),
});
export const run = tool.execute;
export default tool;
