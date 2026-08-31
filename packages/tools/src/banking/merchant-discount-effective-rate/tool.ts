import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  positive,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedSettledSalesMinor: readonly number[];
  readonly observedRefundsMinor: readonly number[];
  readonly observedProcessingFeesMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly netProcessedSalesMinor: number;
  readonly totalObservedProcessingFeesMinor: number;
  readonly effectiveObservedMerchantDiscountPercent: number;
  readonly modeledNetMerchantSettlementMinor: number;
}>;
const inputFields = [
  {
    id: "observedSettledSalesMinor",
    label: "Observed settled sales minor",
    kind: "numberList",
  },
  {
    id: "observedRefundsMinor",
    label: "Observed refunds minor",
    kind: "numberList",
  },
  {
    id: "observedProcessingFeesMinor",
    label: "Observed processing fees minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSettledSalesMinor.forEach((v) =>
    money(v, "observedSettledSalesMinor"),
  );
  input.observedRefundsMinor.forEach((v) => money(v, "observedRefundsMinor"));
  input.observedProcessingFeesMinor.forEach((v) =>
    money(v, "observedProcessingFeesMinor"),
  );
  const volume = integer(
    sumMoney(input.observedSettledSalesMinor) -
      sumMoney(input.observedRefundsMinor),
    "netSales",
  );
  positive(volume, "netProcessedSales");
  const fees = sumMoney(input.observedProcessingFeesMinor);
  return {
    netProcessedSalesMinor: volume,
    totalObservedProcessingFeesMinor: fees,
    effectiveObservedMerchantDiscountPercent: (100 * fees) / volume,
    modeledNetMerchantSettlementMinor: integer(volume - fees, "settlement"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSettledSalesMinor: [10000, 20000],
  observedRefundsMinor: [1000],
  observedProcessingFeesMinor: [300, 100],
} satisfies Input;
export const exampleOutput = {
  netProcessedSalesMinor: 29000,
  totalObservedProcessingFeesMinor: 400,
  effectiveObservedMerchantDiscountPercent: 1.3793103448275863,
  modeledNetMerchantSettlementMinor: 28600,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/merchant-discount-effective-rate",
  title: "Merchant Discount Effective Rate Calculator",
  description:
    "Audit realized processing fees against caller net settled sales after refunds, not existing hypothetical interchange/blended model comparison; reserves, taxes and other settlement adjustments are outside this observed-rate denominator.",
  inputs: inputFields,
  outputs: [
    {
      id: "netProcessedSalesMinor",
      label: "Net processed sales minor",
      kind: "number",
    },
    {
      id: "totalObservedProcessingFeesMinor",
      label: "Total observed processing fees minor",
      kind: "number",
    },
    {
      id: "effectiveObservedMerchantDiscountPercent",
      label: "Effective observed merchant discount percent",
      kind: "number",
    },
    {
      id: "modeledNetMerchantSettlementMinor",
      label: "Modeled net merchant settlement minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSettledSalesMinor:
        value.observedSettledSalesMinor as readonly number[],
      observedRefundsMinor: value.observedRefundsMinor as readonly number[],
      observedProcessingFeesMinor:
        value.observedProcessingFeesMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
