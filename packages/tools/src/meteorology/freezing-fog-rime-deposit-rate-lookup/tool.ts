import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFreezingFogDepositRateKeys: readonly string[];
  readonly callerVerifiedFreezingFogDepositRateValues: readonly number[];
  readonly queryFreezingFogDepositRateKey: string;
  readonly observedFreezingFogDepositRateValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedFreezingFogDepositRateKeys",
    label: "Caller verified freezing fog deposit rate keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFreezingFogDepositRateValues",
    label: "Caller verified freezing fog deposit rate values",
    kind: "numberList",
  },
  {
    id: "queryFreezingFogDepositRateKey",
    label: "Query freezing fog deposit rate key",
    kind: "string",
  },
  {
    id: "observedFreezingFogDepositRateValue",
    label: "Observed freezing fog deposit rate value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedFreezingFogDepositRateKeys,
    input.callerVerifiedFreezingFogDepositRateValues,
    "callerVerifiedFreezingFogDepositRateKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedFreezingFogDepositRateKeys,
    input.queryFreezingFogDepositRateKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedFreezingFogDepositRateValues[i],
    signedObservedMinusReference:
      input.observedFreezingFogDepositRateValue -
      input.callerVerifiedFreezingFogDepositRateValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFreezingFogDepositRateKeys: ["a", "b"],
  callerVerifiedFreezingFogDepositRateValues: [2, 4],
  queryFreezingFogDepositRateKey: "b",
  observedFreezingFogDepositRateValue: 5,
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
  id: "meteorology/freezing-fog-rime-deposit-rate-lookup",
  title: "Freezing Fog Rime Deposit Rate Lookup",
  description:
    "Observed freezing-fog rime accretion rate vs independently matched surface/wind/microphysical reference. Exact caller verified numeric reference; signed deviations retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedFreezingFogDepositRateKeys:
        value.callerVerifiedFreezingFogDepositRateKeys as readonly string[],
      callerVerifiedFreezingFogDepositRateValues:
        value.callerVerifiedFreezingFogDepositRateValues as readonly number[],
      queryFreezingFogDepositRateKey:
        value.queryFreezingFogDepositRateKey as string,
      observedFreezingFogDepositRateValue:
        value.observedFreezingFogDepositRateValue as number,
    }),
});
export const run = tool.execute;
export default tool;
