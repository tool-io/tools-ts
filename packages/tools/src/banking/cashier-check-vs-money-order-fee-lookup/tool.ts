import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  roundMinor,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly requestedInstrumentMinor: number;
  readonly callerCashierFlatFeeMinor: number;
  readonly callerMoneyOrderFaceLimitMinor: number;
  readonly callerMoneyOrderPerInstrumentFeeMinor: number;
}>;
export type Output = Readonly<{
  readonly requiredMoneyOrderCount: number;
  readonly totalMoneyOrderFeesMinor: number;
  readonly signedCashierMinusMoneyOrderFeeMinor: number;
}>;
const inputFields = [
  {
    id: "requestedInstrumentMinor",
    label: "Requested instrument minor",
    kind: "number",
  },
  {
    id: "callerCashierFlatFeeMinor",
    label: "Caller cashier flat fee minor",
    kind: "number",
  },
  {
    id: "callerMoneyOrderFaceLimitMinor",
    label: "Caller money order face limit minor",
    kind: "number",
  },
  {
    id: "callerMoneyOrderPerInstrumentFeeMinor",
    label: "Caller money order per instrument fee minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.requestedInstrumentMinor);
  money(input.callerCashierFlatFeeMinor);
  money(input.callerMoneyOrderPerInstrumentFeeMinor);
  money(input.callerMoneyOrderFaceLimitMinor);
  positive(input.callerMoneyOrderFaceLimitMinor, "faceLimit");
  const count = Math.ceil(
    input.requestedInstrumentMinor / input.callerMoneyOrderFaceLimitMinor,
  );
  bounded(count, "count", 0, 10000);
  const fee = roundMinor(
    BigInt(count) * BigInt(input.callerMoneyOrderPerInstrumentFeeMinor),
    1n,
  );
  return {
    requiredMoneyOrderCount: count,
    totalMoneyOrderFeesMinor: fee,
    signedCashierMinusMoneyOrderFeeMinor: input.callerCashierFlatFeeMinor - fee,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requestedInstrumentMinor: 1000,
  callerCashierFlatFeeMinor: 100,
  callerMoneyOrderFaceLimitMinor: 400,
  callerMoneyOrderPerInstrumentFeeMinor: 20,
} satisfies Input;
export const exampleOutput = {
  requiredMoneyOrderCount: 3,
  totalMoneyOrderFeesMinor: 60,
  signedCashierMinusMoneyOrderFeeMinor: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/cashier-check-vs-money-order-fee-lookup",
  title: "Cashier Check vs Money Order Fee Lookup",
  description:
    "Compare actual requested amount across caller cashier fee versus bounded multiple money orders with explicit face limit, not fee-only static table. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredMoneyOrderCount",
      label: "Required money order count",
      kind: "number",
    },
    {
      id: "totalMoneyOrderFeesMinor",
      label: "Total money order fees minor",
      kind: "number",
    },
    {
      id: "signedCashierMinusMoneyOrderFeeMinor",
      label: "Signed cashier minus money order fee minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      requestedInstrumentMinor: value.requestedInstrumentMinor as number,
      callerCashierFlatFeeMinor: value.callerCashierFlatFeeMinor as number,
      callerMoneyOrderFaceLimitMinor:
        value.callerMoneyOrderFaceLimitMinor as number,
      callerMoneyOrderPerInstrumentFeeMinor:
        value.callerMoneyOrderPerInstrumentFeeMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
