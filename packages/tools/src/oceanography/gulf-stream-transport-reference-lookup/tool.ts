import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerGulfStreamSectionTransportIds: readonly string[];
  readonly callerGulfStreamSectionTransportValues: readonly number[];
  readonly queryGulfStreamSectionTransportId: string;
  readonly observedGulfStreamSectionTransportValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerGulfStreamSectionTransportIds",
    label: "Caller gulf stream section transport ids",
    kind: "stringList",
  },
  {
    id: "callerGulfStreamSectionTransportValues",
    label: "Caller gulf stream section transport values",
    kind: "numberList",
  },
  {
    id: "queryGulfStreamSectionTransportId",
    label: "Query gulf stream section transport id",
    kind: "string",
  },
  {
    id: "observedGulfStreamSectionTransportValue",
    label: "Observed gulf stream section transport value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerGulfStreamSectionTransportIds,
    input.callerGulfStreamSectionTransportValues,
    "callerGulfStreamSectionTransportIds",
  );
  const i = catalogIndex(
    input.callerGulfStreamSectionTransportIds,
    input.queryGulfStreamSectionTransportId,
  );
  return {
    callerMatchedReferenceValue:
      input.callerGulfStreamSectionTransportValues[i],
    signedObservedMinusReference:
      input.observedGulfStreamSectionTransportValue -
      input.callerGulfStreamSectionTransportValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerGulfStreamSectionTransportIds: ["a", "b"],
  callerGulfStreamSectionTransportValues: [2, 4],
  queryGulfStreamSectionTransportId: "b",
  observedGulfStreamSectionTransportValue: 5,
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
  id: "oceanography/gulf-stream-transport-reference-lookup",
  title: "Gulf Stream Transport Reference Lookup",
  description:
    "Audit actual signed Gulf Stream transport against independently verified same section/depth/epoch reference, not an invariant current transport. Independently verified caller edition/site/specimen reference, no fabricated table. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      callerGulfStreamSectionTransportIds:
        value.callerGulfStreamSectionTransportIds as readonly string[],
      callerGulfStreamSectionTransportValues:
        value.callerGulfStreamSectionTransportValues as readonly number[],
      queryGulfStreamSectionTransportId:
        value.queryGulfStreamSectionTransportId as string,
      observedGulfStreamSectionTransportValue:
        value.observedGulfStreamSectionTransportValue as number,
    }),
});
export const run = tool.execute;
export default tool;
