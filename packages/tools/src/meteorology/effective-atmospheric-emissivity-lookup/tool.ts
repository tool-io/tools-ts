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
  readonly callerVerifiedAtmosphericEmissivityKeys: readonly string[];
  readonly callerVerifiedAtmosphericEmissivityValues: readonly number[];
  readonly queryAtmosphericEmissivityKey: string;
  readonly observedAtmosphericEmissivityValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedAtmosphericEmissivityKeys",
    label: "Caller verified atmospheric emissivity keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAtmosphericEmissivityValues",
    label: "Caller verified atmospheric emissivity values",
    kind: "numberList",
  },
  {
    id: "queryAtmosphericEmissivityKey",
    label: "Query atmospheric emissivity key",
    kind: "string",
  },
  {
    id: "observedAtmosphericEmissivityValue",
    label: "Observed atmospheric emissivity value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedAtmosphericEmissivityValues.forEach((v) =>
    fraction(v, "caller physical fraction"),
  );
  fraction(input.observedAtmosphericEmissivityValue, "observed fraction");
  aligned(
    input.callerVerifiedAtmosphericEmissivityKeys,
    input.callerVerifiedAtmosphericEmissivityValues,
    "callerVerifiedAtmosphericEmissivityKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedAtmosphericEmissivityKeys,
    input.queryAtmosphericEmissivityKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedAtmosphericEmissivityValues[i],
    signedObservedMinusReference:
      input.observedAtmosphericEmissivityValue -
      input.callerVerifiedAtmosphericEmissivityValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAtmosphericEmissivityKeys: ["a", "b"],
  callerVerifiedAtmosphericEmissivityValues: [0.2, 0.4],
  queryAtmosphericEmissivityKey: "b",
  observedAtmosphericEmissivityValue: 0.5,
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
  id: "meteorology/effective-atmospheric-emissivity-lookup",
  title: "Effective Atmospheric Emissivity Lookup",
  description:
    "Observed/calibrated clear-sky same-band atmospheric emissivity vs explicit humidity/temperature reference. Exact caller verified numeric reference; signed deviations retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedAtmosphericEmissivityKeys:
        value.callerVerifiedAtmosphericEmissivityKeys as readonly string[],
      callerVerifiedAtmosphericEmissivityValues:
        value.callerVerifiedAtmosphericEmissivityValues as readonly number[],
      queryAtmosphericEmissivityKey:
        value.queryAtmosphericEmissivityKey as string,
      observedAtmosphericEmissivityValue:
        value.observedAtmosphericEmissivityValue as number,
    }),
});
export const run = tool.execute;
export default tool;
