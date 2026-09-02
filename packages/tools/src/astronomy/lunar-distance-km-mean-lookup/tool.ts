import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
  positive,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedLunarDistanceKeys: readonly string[];
  readonly callerVerifiedLunarDistanceValues: readonly number[];
  readonly queryLunarDistanceKey: string;
  readonly observedLunarDistanceValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedLunarDistanceKeys",
    label: "Caller verified lunar distance keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedLunarDistanceValues",
    label: "Caller verified lunar distance values",
    kind: "numberList",
  },
  {
    id: "queryLunarDistanceKey",
    label: "Query lunar distance key",
    kind: "string",
  },
  {
    id: "observedLunarDistanceValue",
    label: "Observed lunar distance value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    ...input.callerVerifiedLunarDistanceValues,
    input.observedLunarDistanceValue,
  ].forEach((v) => positive(v, "lunar distance"));
  aligned(
    input.callerVerifiedLunarDistanceKeys,
    input.callerVerifiedLunarDistanceValues,
    "callerVerifiedLunarDistanceKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedLunarDistanceKeys,
    input.queryLunarDistanceKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedLunarDistanceValues[i],
    signedObservedMinusReference:
      input.observedLunarDistanceValue -
      input.callerVerifiedLunarDistanceValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedLunarDistanceKeys: ["a", "b"],
  callerVerifiedLunarDistanceValues: [2, 4],
  queryLunarDistanceKey: "b",
  observedLunarDistanceValue: 5,
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
  id: "astronomy/lunar-distance-km-mean-lookup",
  title: "Mean Lunar Distance km Lookup",
  description:
    "Independently verified lunar mean/epoch distance convention, not instantaneous geocentric/topocentric range. Exact independently documented reference matching, signed discrepancy retained. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerVerifiedLunarDistanceKeys:
        value.callerVerifiedLunarDistanceKeys as readonly string[],
      callerVerifiedLunarDistanceValues:
        value.callerVerifiedLunarDistanceValues as readonly number[],
      queryLunarDistanceKey: value.queryLunarDistanceKey as string,
      observedLunarDistanceValue: value.observedLunarDistanceValue as number,
    }),
});
export const run = tool.execute;
export default tool;
