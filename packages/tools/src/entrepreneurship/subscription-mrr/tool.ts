import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly planNames: readonly string[];
  readonly subscriberCounts: readonly number[];
  readonly billingAmounts: readonly number[];
  readonly billingPeriodMonths: readonly number[];
}>;
export type Output = Readonly<{
  readonly planMrr: readonly number[];
  readonly totalMrr: number;
  readonly annualizedRunRate: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.planNames, input.subscriberCounts, "planNames");
  const n = input.planNames.length;
  if (
    input.billingAmounts.length !== n ||
    input.billingPeriodMonths.length !== n
  )
    simpleError(
      "billingAmounts",
      "Aligned plan billing amounts and periods required.",
    );
  input.subscriberCounts.forEach((v) => count(v, "subscriberCounts"));
  input.billingAmounts.forEach((v) => nonnegative(v, "billingAmounts"));
  input.billingPeriodMonths.forEach((v) => count(v, "billingPeriodMonths", 1));
  const planMrr = input.subscriberCounts.map(
      (v, i) => (v * input.billingAmounts[i]) / input.billingPeriodMonths[i],
    ),
    totalMrr = planMrr.reduce((a, b) => a + b, 0);
  return { planMrr, totalMrr, annualizedRunRate: 12 * totalMrr };
};
export const exampleInput = {
  planNames: ["monthly", "annual"],
  subscriberCounts: [10, 5],
  billingAmounts: [20, 120],
  billingPeriodMonths: [1, 12],
} satisfies Input;
export const exampleOutput = {
  planMrr: [200, 50],
  totalMrr: 250,
  annualizedRunRate: 3000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/subscription-mrr",
  title: "Subscription MRR",
  description:
    "Normalize subscription billing plans to recurring monthly revenue and annualized run rate.",
  inputs: [
    { id: "planNames", label: "Plan names", kind: "stringList" },
    { id: "subscriberCounts", label: "Subscriber counts", kind: "numberList" },
    { id: "billingAmounts", label: "Billing amounts", kind: "numberList" },
    {
      id: "billingPeriodMonths",
      label: "Billing period months",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "planMrr", label: "Plan mrr", kind: "numberList" },
    { id: "totalMrr", label: "Total mrr", kind: "number" },
    { id: "annualizedRunRate", label: "Annualized run rate", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      planNames: value.planNames as readonly string[],
      subscriberCounts: value.subscriberCounts as readonly number[],
      billingAmounts: value.billingAmounts as readonly number[],
      billingPeriodMonths: value.billingPeriodMonths as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
