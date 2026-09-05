import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  aligned,
  catalogIndex,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSurfaceAlbedoKeys: readonly string[];
  readonly callerVerifiedSurfaceAlbedoValues: readonly number[];
  readonly querySurfaceAlbedoKey: string;
  readonly observedSurfaceAlbedoValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedSurfaceAlbedoKeys",
    label: "Caller verified surface albedo keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSurfaceAlbedoValues",
    label: "Caller verified surface albedo values",
    kind: "numberList",
  },
  {
    id: "querySurfaceAlbedoKey",
    label: "Query surface albedo key",
    kind: "string",
  },
  {
    id: "observedSurfaceAlbedoValue",
    label: "Observed surface albedo value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedSurfaceAlbedoValues.forEach((v) =>
    fraction(v, "caller physical fraction"),
  );
  fraction(input.observedSurfaceAlbedoValue, "observed fraction");
  aligned(
    input.callerVerifiedSurfaceAlbedoKeys,
    input.callerVerifiedSurfaceAlbedoValues,
    "callerVerifiedSurfaceAlbedoKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedSurfaceAlbedoKeys,
    input.querySurfaceAlbedoKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedSurfaceAlbedoValues[i],
    signedObservedMinusReference:
      input.observedSurfaceAlbedoValue -
      input.callerVerifiedSurfaceAlbedoValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedSurfaceAlbedoKeys: ["a", "b"],
  callerVerifiedSurfaceAlbedoValues: [0.2, 0.4],
  querySurfaceAlbedoKey: "b",
  observedSurfaceAlbedoValue: 0.5,
} satisfies Input;
export const exampleOutput = {
  callerReferenceValue: 0.4,
  signedObservedMinusReference: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/albedo-surface-type-table-lookup",
  title: "Albedo Surface Type Table Lookup",
  description:
    "Observed same-spectrum/geometry surface albedo vs caller reference, not a universal static surface-type constant. Exact caller verified numeric reference; signed deviations retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedSurfaceAlbedoKeys:
        value.callerVerifiedSurfaceAlbedoKeys as readonly string[],
      callerVerifiedSurfaceAlbedoValues:
        value.callerVerifiedSurfaceAlbedoValues as readonly number[],
      querySurfaceAlbedoKey: value.querySurfaceAlbedoKey as string,
      observedSurfaceAlbedoValue: value.observedSurfaceAlbedoValue as number,
    }),
});
export const run = tool.execute;
export default tool;
