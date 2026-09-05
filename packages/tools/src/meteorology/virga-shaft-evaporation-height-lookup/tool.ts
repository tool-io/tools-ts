import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedVirgaEvaporationHeightKeys: readonly string[];
  readonly callerVerifiedVirgaEvaporationHeightValues: readonly number[];
  readonly queryVirgaEvaporationHeightKey: string;
  readonly observedVirgaEvaporationHeightValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedVirgaEvaporationHeightKeys",
    label: "Caller verified virga evaporation height keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedVirgaEvaporationHeightValues",
    label: "Caller verified virga evaporation height values",
    kind: "numberList",
  },
  {
    id: "queryVirgaEvaporationHeightKey",
    label: "Query virga evaporation height key",
    kind: "string",
  },
  {
    id: "observedVirgaEvaporationHeightValue",
    label: "Observed virga evaporation height value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedVirgaEvaporationHeightKeys,
    input.callerVerifiedVirgaEvaporationHeightValues,
    "callerVerifiedVirgaEvaporationHeightKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedVirgaEvaporationHeightKeys,
    input.queryVirgaEvaporationHeightKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedVirgaEvaporationHeightValues[i],
    signedObservedMinusReference:
      input.observedVirgaEvaporationHeightValue -
      input.callerVerifiedVirgaEvaporationHeightValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedVirgaEvaporationHeightKeys: ["a", "b"],
  callerVerifiedVirgaEvaporationHeightValues: [2, 4],
  queryVirgaEvaporationHeightKey: "b",
  observedVirgaEvaporationHeightValue: 5,
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
  id: "meteorology/virga-shaft-evaporation-height-lookup",
  title: "Virga Shaft Evaporation Height Lookup",
  description:
    "Observed virga evaporation height vs independently matched humidity/profile reference, not rainfall-at-ground forecast. Exact caller verified numeric reference; signed deviations retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedVirgaEvaporationHeightKeys:
        value.callerVerifiedVirgaEvaporationHeightKeys as readonly string[],
      callerVerifiedVirgaEvaporationHeightValues:
        value.callerVerifiedVirgaEvaporationHeightValues as readonly number[],
      queryVirgaEvaporationHeightKey:
        value.queryVirgaEvaporationHeightKey as string,
      observedVirgaEvaporationHeightValue:
        value.observedVirgaEvaporationHeightValue as number,
    }),
});
export const run = tool.execute;
export default tool;
