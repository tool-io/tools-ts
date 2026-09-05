import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTransientLuminousAltitudeKmKeys: readonly string[];
  readonly callerVerifiedTransientLuminousAltitudeKmValues: readonly number[];
  readonly queryTransientLuminousAltitudeKmKey: string;
  readonly observedTransientLuminousAltitudeKmValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedTransientLuminousAltitudeKmKeys",
    label: "Caller verified transient luminous altitude km keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTransientLuminousAltitudeKmValues",
    label: "Caller verified transient luminous altitude km values",
    kind: "numberList",
  },
  {
    id: "queryTransientLuminousAltitudeKmKey",
    label: "Query transient luminous altitude km key",
    kind: "string",
  },
  {
    id: "observedTransientLuminousAltitudeKmValue",
    label: "Observed transient luminous altitude km value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedTransientLuminousAltitudeKmKeys,
    input.callerVerifiedTransientLuminousAltitudeKmValues,
    "callerVerifiedTransientLuminousAltitudeKmKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedTransientLuminousAltitudeKmKeys,
    input.queryTransientLuminousAltitudeKmKey,
  );
  return {
    callerReferenceValue:
      input.callerVerifiedTransientLuminousAltitudeKmValues[i],
    signedObservedMinusReference:
      input.observedTransientLuminousAltitudeKmValue -
      input.callerVerifiedTransientLuminousAltitudeKmValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTransientLuminousAltitudeKmKeys: ["a", "b"],
  callerVerifiedTransientLuminousAltitudeKmValues: [2, 4],
  queryTransientLuminousAltitudeKmKey: "b",
  observedTransientLuminousAltitudeKmValue: 5,
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
  id: "meteorology/sprite-blue-jet-altitude-range-lookup",
  title: "Sprite Blue Jet Altitude Range Lookup",
  description:
    "Observed sprite/blue-jet altitude vs caller independently verified event/method range reference. Exact caller verified numeric reference; signed deviations retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedTransientLuminousAltitudeKmKeys:
        value.callerVerifiedTransientLuminousAltitudeKmKeys as readonly string[],
      callerVerifiedTransientLuminousAltitudeKmValues:
        value.callerVerifiedTransientLuminousAltitudeKmValues as readonly number[],
      queryTransientLuminousAltitudeKmKey:
        value.queryTransientLuminousAltitudeKmKey as string,
      observedTransientLuminousAltitudeKmValue:
        value.observedTransientLuminousAltitudeKmValue as number,
    }),
});
export const run = tool.execute;
export default tool;
