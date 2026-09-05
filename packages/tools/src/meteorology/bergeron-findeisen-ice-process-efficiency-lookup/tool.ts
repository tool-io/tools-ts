import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedBergeronEfficiencyKeys: readonly string[];
  readonly callerVerifiedBergeronEfficiencyValues: readonly number[];
  readonly queryBergeronEfficiencyKey: string;
  readonly observedBergeronEfficiencyValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedBergeronEfficiencyKeys",
    label: "Caller verified bergeron efficiency keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedBergeronEfficiencyValues",
    label: "Caller verified bergeron efficiency values",
    kind: "numberList",
  },
  {
    id: "queryBergeronEfficiencyKey",
    label: "Query bergeron efficiency key",
    kind: "string",
  },
  {
    id: "observedBergeronEfficiencyValue",
    label: "Observed bergeron efficiency value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedBergeronEfficiencyKeys,
    input.callerVerifiedBergeronEfficiencyValues,
    "callerVerifiedBergeronEfficiencyKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedBergeronEfficiencyKeys,
    input.queryBergeronEfficiencyKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedBergeronEfficiencyValues[i],
    signedObservedMinusReference:
      input.observedBergeronEfficiencyValue -
      input.callerVerifiedBergeronEfficiencyValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedBergeronEfficiencyKeys: ["a", "b"],
  callerVerifiedBergeronEfficiencyValues: [2, 4],
  queryBergeronEfficiencyKey: "b",
  observedBergeronEfficiencyValue: 5,
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
  id: "meteorology/bergeron-findeisen-ice-process-efficiency-lookup",
  title: "Bergeron Findeisen Ice Process Efficiency Lookup",
  description:
    "Observed same-temperature/cloud-liquid/ice supersaturation efficiency vs independently verified phase-process reference. Exact caller verified numeric reference; signed deviations retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedBergeronEfficiencyKeys:
        value.callerVerifiedBergeronEfficiencyKeys as readonly string[],
      callerVerifiedBergeronEfficiencyValues:
        value.callerVerifiedBergeronEfficiencyValues as readonly number[],
      queryBergeronEfficiencyKey: value.queryBergeronEfficiencyKey as string,
      observedBergeronEfficiencyValue:
        value.observedBergeronEfficiencyValue as number,
    }),
});
export const run = tool.execute;
export default tool;
