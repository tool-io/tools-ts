import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedMarketplaceTakeRateKeys: readonly string[];
  readonly callerVerifiedMarketplaceTakeRateValues: readonly number[];
  readonly queryMarketplaceTakeRateKey: string;
  readonly observedMarketplaceTakeRateValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedMarketplaceTakeRateKeys",
    label: "Caller verified marketplace take rate keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMarketplaceTakeRateValues",
    label: "Caller verified marketplace take rate values",
    kind: "numberList",
  },
  {
    id: "queryMarketplaceTakeRateKey",
    label: "Query marketplace take rate key",
    kind: "string",
  },
  {
    id: "observedMarketplaceTakeRateValue",
    label: "Observed marketplace take rate value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedMarketplaceTakeRateKeys,
    input.callerVerifiedMarketplaceTakeRateValues,
    "callerVerifiedMarketplaceTakeRateKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedMarketplaceTakeRateKeys,
    input.queryMarketplaceTakeRateKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedMarketplaceTakeRateValues[i],
    signedObservedMinusReference:
      input.observedMarketplaceTakeRateValue -
      input.callerVerifiedMarketplaceTakeRateValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedMarketplaceTakeRateKeys: ["a", "b"],
  callerVerifiedMarketplaceTakeRateValues: [2, 4],
  queryMarketplaceTakeRateKey: "b",
  observedMarketplaceTakeRateValue: 5,
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
  id: "entrepreneurship/marketplace-take-rate-commission-benchmarks-lookup",
  title: "Marketplace Take Rate Commission Benchmarks Lookup",
  description:
    "Observed gross/net-defined marketplace commission take rate vs caller verified market/period reference. Exact independently matched reference; signed deviations retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedMarketplaceTakeRateKeys:
        value.callerVerifiedMarketplaceTakeRateKeys as readonly string[],
      callerVerifiedMarketplaceTakeRateValues:
        value.callerVerifiedMarketplaceTakeRateValues as readonly number[],
      queryMarketplaceTakeRateKey: value.queryMarketplaceTakeRateKey as string,
      observedMarketplaceTakeRateValue:
        value.observedMarketplaceTakeRateValue as number,
    }),
});
export const run = tool.execute;
export default tool;
