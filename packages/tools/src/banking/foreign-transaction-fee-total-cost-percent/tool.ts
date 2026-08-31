import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  positive,
  bounded,
  weightedMinor,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly homeCurrencyConvertedPurchaseMinor: number;
  readonly callerForeignTransactionFeeBasisPoints: number;
  readonly observedAdditionalConversionCostMinor: number;
}>;
export type Output = Readonly<{
  readonly foreignTransactionFeeMinor: number;
  readonly totalObservedAndModeledFxExtraCostMinor: number;
  readonly effectiveFxExtraCostPercent: number;
  readonly totalHomeCurrencyCostMinor: number;
}>;
const inputFields = [
  {
    id: "homeCurrencyConvertedPurchaseMinor",
    label: "Home currency converted purchase minor",
    kind: "number",
  },
  {
    id: "callerForeignTransactionFeeBasisPoints",
    label: "Caller foreign transaction fee basis points",
    kind: "number",
  },
  {
    id: "observedAdditionalConversionCostMinor",
    label: "Observed additional conversion cost minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.homeCurrencyConvertedPurchaseMinor,
    "homeCurrencyConvertedPurchaseMinor",
  );
  money(
    input.observedAdditionalConversionCostMinor,
    "observedAdditionalConversionCostMinor",
  );
  positive(input.homeCurrencyConvertedPurchaseMinor, "convertedPurchase");
  bounded(input.callerForeignTransactionFeeBasisPoints, "fee", 0, 10000);
  const fee = weightedMinor(
      input.homeCurrencyConvertedPurchaseMinor,
      input.callerForeignTransactionFeeBasisPoints,
      10000,
    ),
    extra = sumMoney([fee, input.observedAdditionalConversionCostMinor]);
  return {
    foreignTransactionFeeMinor: fee,
    totalObservedAndModeledFxExtraCostMinor: extra,
    effectiveFxExtraCostPercent:
      (100 * extra) / input.homeCurrencyConvertedPurchaseMinor,
    totalHomeCurrencyCostMinor: sumMoney([
      input.homeCurrencyConvertedPurchaseMinor,
      extra,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  homeCurrencyConvertedPurchaseMinor: 10000,
  callerForeignTransactionFeeBasisPoints: 300,
  observedAdditionalConversionCostMinor: 100,
} satisfies Input;
export const exampleOutput = {
  foreignTransactionFeeMinor: 300,
  totalObservedAndModeledFxExtraCostMinor: 400,
  effectiveFxExtraCostPercent: 4,
  totalHomeCurrencyCostMinor: 10400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/foreign-transaction-fee-total-cost-percent",
  title: "Foreign Transaction Fee Total Cost Percent Calculator",
  description:
    "Reconcile already converted home-currency purchase with caller foreign-transaction rate and separately observed conversion spread cost; no market FX/DCC spread invention, double-counting of fees already in base or zero-denominator percentage.",
  inputs: inputFields,
  outputs: [
    {
      id: "foreignTransactionFeeMinor",
      label: "Foreign transaction fee minor",
      kind: "number",
    },
    {
      id: "totalObservedAndModeledFxExtraCostMinor",
      label: "Total observed and modeled fx extra cost minor",
      kind: "number",
    },
    {
      id: "effectiveFxExtraCostPercent",
      label: "Effective fx extra cost percent",
      kind: "number",
    },
    {
      id: "totalHomeCurrencyCostMinor",
      label: "Total home currency cost minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      homeCurrencyConvertedPurchaseMinor:
        value.homeCurrencyConvertedPurchaseMinor as number,
      callerForeignTransactionFeeBasisPoints:
        value.callerForeignTransactionFeeBasisPoints as number,
      observedAdditionalConversionCostMinor:
        value.observedAdditionalConversionCostMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
