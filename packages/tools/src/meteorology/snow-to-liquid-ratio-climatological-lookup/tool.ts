import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSnowLiquidRatioKeys: readonly string[];
  readonly callerVerifiedSnowLiquidRatioValues: readonly number[];
  readonly querySnowLiquidRatioKey: string;
  readonly observedSnowLiquidRatioValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedSnowLiquidRatioKeys",
    label: "Caller verified snow liquid ratio keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSnowLiquidRatioValues",
    label: "Caller verified snow liquid ratio values",
    kind: "numberList",
  },
  {
    id: "querySnowLiquidRatioKey",
    label: "Query snow liquid ratio key",
    kind: "string",
  },
  {
    id: "observedSnowLiquidRatioValue",
    label: "Observed snow liquid ratio value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedSnowLiquidRatioKeys,
    input.callerVerifiedSnowLiquidRatioValues,
    "callerVerifiedSnowLiquidRatioKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedSnowLiquidRatioKeys,
    input.querySnowLiquidRatioKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedSnowLiquidRatioValues[i],
    signedObservedMinusReference:
      input.observedSnowLiquidRatioValue -
      input.callerVerifiedSnowLiquidRatioValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedSnowLiquidRatioKeys: ["a", "b"],
  callerVerifiedSnowLiquidRatioValues: [2, 4],
  querySnowLiquidRatioKey: "b",
  observedSnowLiquidRatioValue: 5,
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
  id: "meteorology/snow-to-liquid-ratio-climatological-lookup",
  title: "Snow To Liquid Ratio Climatological Lookup",
  description:
    "Observed independently melted snowfall water ratio against caller same-region/month measurement reference; no snow amount forecast. Exact caller verified numeric reference; signed deviations retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedSnowLiquidRatioKeys:
        value.callerVerifiedSnowLiquidRatioKeys as readonly string[],
      callerVerifiedSnowLiquidRatioValues:
        value.callerVerifiedSnowLiquidRatioValues as readonly number[],
      querySnowLiquidRatioKey: value.querySnowLiquidRatioKey as string,
      observedSnowLiquidRatioValue:
        value.observedSnowLiquidRatioValue as number,
    }),
});
export const run = tool.execute;
export default tool;
