import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerAmpacityIds: readonly string[];
  readonly callerAmpacityValues: readonly number[];
  readonly queryAmpacityId: string;
  readonly observedAmpacityValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  { id: "callerAmpacityIds", label: "Caller ampacity ids", kind: "stringList" },
  {
    id: "callerAmpacityValues",
    label: "Caller ampacity values",
    kind: "numberList",
  },
  { id: "queryAmpacityId", label: "Query ampacity id", kind: "string" },
  {
    id: "observedAmpacityValue",
    label: "Observed ampacity value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerAmpacityIds,
    input.callerAmpacityValues,
    "callerAmpacityIds",
  );
  const i = catalogIndex(input.callerAmpacityIds, input.queryAmpacityId);
  return {
    callerMatchedReferenceValue: input.callerAmpacityValues[i],
    signedObservedMinusReference:
      input.observedAmpacityValue - input.callerAmpacityValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAmpacityIds: ["a", "b"],
  callerAmpacityValues: [2, 4],
  queryAmpacityId: "b",
  observedAmpacityValue: 5,
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
  id: "engineering/wire-ampacity-lookup",
  title: "Wire Ampacity Lookup",
  description:
    "Audit actual installation current against independently verified same-edition/temperature/conductor ampacity reference. Independently verified caller edition/site/specimen reference, no fabricated table. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      callerAmpacityIds: value.callerAmpacityIds as readonly string[],
      callerAmpacityValues: value.callerAmpacityValues as readonly number[],
      queryAmpacityId: value.queryAmpacityId as string,
      observedAmpacityValue: value.observedAmpacityValue as number,
    }),
});
export const run = tool.execute;
export default tool;
