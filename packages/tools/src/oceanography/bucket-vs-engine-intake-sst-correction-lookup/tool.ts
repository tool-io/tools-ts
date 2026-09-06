import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerSstMethodBiasIds: readonly string[];
  readonly callerSstMethodBiasValues: readonly number[];
  readonly querySstMethodBiasId: string;
  readonly observedSstMethodBiasValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerSstMethodBiasIds",
    label: "Caller sst method bias ids",
    kind: "stringList",
  },
  {
    id: "callerSstMethodBiasValues",
    label: "Caller sst method bias values",
    kind: "numberList",
  },
  {
    id: "querySstMethodBiasId",
    label: "Query sst method bias id",
    kind: "string",
  },
  {
    id: "observedSstMethodBiasValue",
    label: "Observed sst method bias value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerSstMethodBiasIds,
    input.callerSstMethodBiasValues,
    "callerSstMethodBiasIds",
  );
  const i = catalogIndex(
    input.callerSstMethodBiasIds,
    input.querySstMethodBiasId,
  );
  return {
    callerMatchedReferenceValue: input.callerSstMethodBiasValues[i],
    signedObservedMinusReference:
      input.observedSstMethodBiasValue - input.callerSstMethodBiasValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSstMethodBiasIds: ["a", "b"],
  callerSstMethodBiasValues: [2, 4],
  querySstMethodBiasId: "b",
  observedSstMethodBiasValue: 5,
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
  id: "oceanography/bucket-vs-engine-intake-sst-correction-lookup",
  title: "Bucket vs Engine Intake SST Correction Lookup",
  description:
    "Audit actual bucket/engine-intake SST difference against exact independently verified platform/method/epoch bias reference, not blanket correction. Independently verified caller edition/site/specimen reference, no fabricated table. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      callerSstMethodBiasIds: value.callerSstMethodBiasIds as readonly string[],
      callerSstMethodBiasValues:
        value.callerSstMethodBiasValues as readonly number[],
      querySstMethodBiasId: value.querySstMethodBiasId as string,
      observedSstMethodBiasValue: value.observedSstMethodBiasValue as number,
    }),
});
export const run = tool.execute;
export default tool;
