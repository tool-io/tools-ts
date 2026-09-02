import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  safeText,
  sumMoney,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedCashTransactionMinor: readonly number[];
  readonly observedAggregationGroupIds: readonly string[];
  readonly callerCashReportingThresholdMinor: number;
  readonly callerTriggerStrictlyAbove: boolean;
}>;
export type Output = Readonly<{
  readonly aggregationGroupIds: readonly string[];
  readonly aggregatedCashMinor: readonly number[];
  readonly callerReportingReviewGroupIds: readonly string[];
}>;
const inputFields = [
  {
    id: "observedCashTransactionMinor",
    label: "Observed cash transaction minor",
    kind: "numberList",
  },
  {
    id: "observedAggregationGroupIds",
    label: "Observed aggregation group ids",
    kind: "stringList",
  },
  {
    id: "callerCashReportingThresholdMinor",
    label: "Caller cash reporting threshold minor",
    kind: "number",
  },
  {
    id: "callerTriggerStrictlyAbove",
    label: "Caller trigger strictly above",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedCashTransactionMinor,
    input.observedAggregationGroupIds,
    "cash",
  );
  money(input.callerCashReportingThresholdMinor);
  input.observedCashTransactionMinor.forEach((v) => money(v));
  input.observedAggregationGroupIds.forEach((v) => safeText(v, "group"));
  const ids = [...new Set(input.observedAggregationGroupIds)],
    total = ids.map((id) =>
      sumMoney(
        input.observedCashTransactionMinor.filter(
          (_, i) => input.observedAggregationGroupIds[i] === id,
        ),
      ),
    );
  return {
    aggregationGroupIds: ids,
    aggregatedCashMinor: total,
    callerReportingReviewGroupIds: ids.filter((_, i) =>
      input.callerTriggerStrictlyAbove
        ? total[i] > input.callerCashReportingThresholdMinor
        : total[i] >= input.callerCashReportingThresholdMinor,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCashTransactionMinor: [600, 500],
  observedAggregationGroupIds: ["day-person-a", "day-person-a"],
  callerCashReportingThresholdMinor: 1000,
  callerTriggerStrictlyAbove: true,
} satisfies Input;
export const exampleOutput = {
  aggregationGroupIds: ["day-person-a"],
  aggregatedCashMinor: [1100],
  callerReportingReviewGroupIds: ["day-person-a"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/ctr-cash-reporting-threshold-checker",
  title: "CTR Cash Reporting Threshold Checker",
  description:
    "Aggregate actual cash ledger by independently caller resolved person/day group then apply explicit strict/inclusive reporting threshold, not per-transaction threshold. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "aggregationGroupIds",
      label: "Aggregation group ids",
      kind: "stringList",
    },
    {
      id: "aggregatedCashMinor",
      label: "Aggregated cash minor",
      kind: "numberList",
    },
    {
      id: "callerReportingReviewGroupIds",
      label: "Caller reporting review group ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCashTransactionMinor:
        value.observedCashTransactionMinor as readonly number[],
      observedAggregationGroupIds:
        value.observedAggregationGroupIds as readonly string[],
      callerCashReportingThresholdMinor:
        value.callerCashReportingThresholdMinor as number,
      callerTriggerStrictlyAbove: value.callerTriggerStrictlyAbove as boolean,
    }),
});
export const run = tool.execute;
export default tool;
