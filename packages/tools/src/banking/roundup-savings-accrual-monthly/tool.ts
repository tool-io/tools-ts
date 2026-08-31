import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  bounded,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly eligiblePurchaseAmountsMinor: readonly number[];
  readonly callerRoundupUnitMinor: number;
  readonly callerCycleTransferCapMinor: number;
}>;
export type Output = Readonly<{
  readonly perPurchaseRequestedRoundupsMinor: readonly number[];
  readonly requestedRoundupTotalMinor: number;
  readonly appliedCycleTransferMinor: number;
  readonly untransferredDueToCallerCapMinor: number;
}>;
const inputFields = [
  {
    id: "eligiblePurchaseAmountsMinor",
    label: "Eligible purchase amounts minor",
    kind: "numberList",
  },
  {
    id: "callerRoundupUnitMinor",
    label: "Caller roundup unit minor",
    kind: "number",
  },
  {
    id: "callerCycleTransferCapMinor",
    label: "Caller cycle transfer cap minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.eligiblePurchaseAmountsMinor.forEach((v) =>
    money(v, "eligiblePurchaseAmountsMinor"),
  );
  money(input.callerCycleTransferCapMinor, "callerCycleTransferCapMinor");
  bounded(input.callerRoundupUnitMinor, "unit", 1, 1000000);
  const rounded = input.eligiblePurchaseAmountsMinor.map(
      (v) =>
        (input.callerRoundupUnitMinor - (v % input.callerRoundupUnitMinor)) %
        input.callerRoundupUnitMinor,
    ),
    total = sumMoney(rounded),
    applied = Math.min(total, input.callerCycleTransferCapMinor);
  return {
    perPurchaseRequestedRoundupsMinor: rounded,
    requestedRoundupTotalMinor: total,
    appliedCycleTransferMinor: applied,
    untransferredDueToCallerCapMinor: total - applied,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eligiblePurchaseAmountsMinor: [101, 200, 299],
  callerRoundupUnitMinor: 100,
  callerCycleTransferCapMinor: 80,
} satisfies Input;
export const exampleOutput = {
  perPurchaseRequestedRoundupsMinor: [99, 0, 1],
  requestedRoundupTotalMinor: 100,
  appliedCycleTransferMinor: 80,
  untransferredDueToCallerCapMinor: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/roundup-savings-accrual-monthly",
  title: "Roundup Savings Accrual Monthly Calculator",
  description:
    "Compute observed eligible purchase roundups to caller minor-unit multiples, preserving exact-multiple zero roundups and capped-cycle shortfall; refunds/exclusions and actual transfer authorization remain caller evidence.",
  inputs: inputFields,
  outputs: [
    {
      id: "perPurchaseRequestedRoundupsMinor",
      label: "Per purchase requested roundups minor",
      kind: "numberList",
    },
    {
      id: "requestedRoundupTotalMinor",
      label: "Requested roundup total minor",
      kind: "number",
    },
    {
      id: "appliedCycleTransferMinor",
      label: "Applied cycle transfer minor",
      kind: "number",
    },
    {
      id: "untransferredDueToCallerCapMinor",
      label: "Untransferred due to caller cap minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eligiblePurchaseAmountsMinor:
        value.eligiblePurchaseAmountsMinor as readonly number[],
      callerRoundupUnitMinor: value.callerRoundupUnitMinor as number,
      callerCycleTransferCapMinor: value.callerCycleTransferCapMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
