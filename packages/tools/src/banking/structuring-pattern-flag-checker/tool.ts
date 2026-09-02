import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  safeText,
  sumMoney,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedTransactionMinor: readonly number[];
  readonly observedCallerLinkedGroupIds: readonly string[];
  readonly callerSingleTransactionCeilingMinor: number;
  readonly callerAggregateReviewFloorMinor: number;
  readonly callerMinimumLinkedCount: number;
}>;
export type Output = Readonly<{
  readonly patternReviewGroupIds: readonly string[];
  readonly reviewGroupAggregateMinor: readonly number[];
}>;
const inputFields = [
  {
    id: "observedTransactionMinor",
    label: "Observed transaction minor",
    kind: "numberList",
  },
  {
    id: "observedCallerLinkedGroupIds",
    label: "Observed caller linked group ids",
    kind: "stringList",
  },
  {
    id: "callerSingleTransactionCeilingMinor",
    label: "Caller single transaction ceiling minor",
    kind: "number",
  },
  {
    id: "callerAggregateReviewFloorMinor",
    label: "Caller aggregate review floor minor",
    kind: "number",
  },
  {
    id: "callerMinimumLinkedCount",
    label: "Caller minimum linked count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedTransactionMinor,
    input.observedCallerLinkedGroupIds,
    "ledger",
  );
  input.observedTransactionMinor.forEach((v) => money(v));
  input.observedCallerLinkedGroupIds.forEach((v) => safeText(v, "linkedGroup"));
  money(input.callerSingleTransactionCeilingMinor);
  money(input.callerAggregateReviewFloorMinor);
  bounded(input.callerMinimumLinkedCount, "count", 2, 128);
  const review: string[] = [],
    totals: number[] = [];
  for (const id of new Set(input.observedCallerLinkedGroupIds)) {
    const amounts = input.observedTransactionMinor.filter(
        (_, i) => input.observedCallerLinkedGroupIds[i] === id,
      ),
      total = sumMoney(amounts);
    if (
      amounts.length >= input.callerMinimumLinkedCount &&
      amounts.every((v) => v < input.callerSingleTransactionCeilingMinor) &&
      total >= input.callerAggregateReviewFloorMinor
    ) {
      review.push(id);
      totals.push(total);
    }
  }
  return { patternReviewGroupIds: review, reviewGroupAggregateMinor: totals };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTransactionMinor: [400, 400, 400],
  observedCallerLinkedGroupIds: ["a", "a", "a"],
  callerSingleTransactionCeilingMinor: 500,
  callerAggregateReviewFloorMinor: 1000,
  callerMinimumLinkedCount: 3,
} satisfies Input;
export const exampleOutput = {
  patternReviewGroupIds: ["a"],
  reviewGroupAggregateMinor: [1200],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/structuring-pattern-flag-checker",
  title: "Structuring Pattern Flag Checker",
  description:
    "Screen actual caller linked ledger for repeated sub-ceiling aggregate review pattern, does not infer intent, criminal structuring or evasion; no advice on avoiding reports. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "patternReviewGroupIds",
      label: "Pattern review group ids",
      kind: "stringList",
    },
    {
      id: "reviewGroupAggregateMinor",
      label: "Review group aggregate minor",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTransactionMinor:
        value.observedTransactionMinor as readonly number[],
      observedCallerLinkedGroupIds:
        value.observedCallerLinkedGroupIds as readonly string[],
      callerSingleTransactionCeilingMinor:
        value.callerSingleTransactionCeilingMinor as number,
      callerAggregateReviewFloorMinor:
        value.callerAggregateReviewFloorMinor as number,
      callerMinimumLinkedCount: value.callerMinimumLinkedCount as number,
    }),
});
export const run = tool.execute;
export default tool;
