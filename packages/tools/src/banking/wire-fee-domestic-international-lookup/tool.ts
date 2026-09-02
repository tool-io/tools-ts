import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  catalogIndex,
  sumMoney,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerWireRouteIds: readonly string[];
  readonly callerSendFeesMinor: readonly number[];
  readonly callerCorrespondentFeesMinor: readonly number[];
  readonly callerReceiveFeesMinor: readonly number[];
  readonly queryWireRouteId: string;
  readonly observedQuotedTotalMinor: number;
}>;
export type Output = Readonly<{
  readonly callerWireTotalFeeMinor: number;
  readonly signedQuoteMinusCallerFeeMinor: number;
}>;
const inputFields = [
  {
    id: "callerWireRouteIds",
    label: "Caller wire route ids",
    kind: "stringList",
  },
  {
    id: "callerSendFeesMinor",
    label: "Caller send fees minor",
    kind: "numberList",
  },
  {
    id: "callerCorrespondentFeesMinor",
    label: "Caller correspondent fees minor",
    kind: "numberList",
  },
  {
    id: "callerReceiveFeesMinor",
    label: "Caller receive fees minor",
    kind: "numberList",
  },
  { id: "queryWireRouteId", label: "Query wire route id", kind: "string" },
  {
    id: "observedQuotedTotalMinor",
    label: "Observed quoted total minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerWireRouteIds, "routes");
  for (const v of [
    input.callerSendFeesMinor,
    input.callerCorrespondentFeesMinor,
    input.callerReceiveFeesMinor,
  ]) {
    aligned(input.callerWireRouteIds, v, "fees");
    v.forEach((x) => money(x));
  }
  money(input.observedQuotedTotalMinor);
  const i = catalogIndex(input.callerWireRouteIds, input.queryWireRouteId),
    total = sumMoney([
      input.callerSendFeesMinor[i],
      input.callerCorrespondentFeesMinor[i],
      input.callerReceiveFeesMinor[i],
    ]);
  return {
    callerWireTotalFeeMinor: total,
    signedQuoteMinusCallerFeeMinor: input.observedQuotedTotalMinor - total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWireRouteIds: ["domestic", "international"],
  callerSendFeesMinor: [100, 200],
  callerCorrespondentFeesMinor: [0, 50],
  callerReceiveFeesMinor: [20, 30],
  queryWireRouteId: "international",
  observedQuotedTotalMinor: 300,
} satisfies Input;
export const exampleOutput = {
  callerWireTotalFeeMinor: 280,
  signedQuoteMinusCallerFeeMinor: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/wire-fee-domestic-international-lookup",
  title: "Wire Fee Domestic International Lookup",
  description:
    "Reconcile actual wire quote against caller route-specific send/correspondent/receive inventory, not stale bank fee lookup. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerWireTotalFeeMinor",
      label: "Caller wire total fee minor",
      kind: "number",
    },
    {
      id: "signedQuoteMinusCallerFeeMinor",
      label: "Signed quote minus caller fee minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerWireRouteIds: value.callerWireRouteIds as readonly string[],
      callerSendFeesMinor: value.callerSendFeesMinor as readonly number[],
      callerCorrespondentFeesMinor:
        value.callerCorrespondentFeesMinor as readonly number[],
      callerReceiveFeesMinor: value.callerReceiveFeesMinor as readonly number[],
      queryWireRouteId: value.queryWireRouteId as string,
      observedQuotedTotalMinor: value.observedQuotedTotalMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
