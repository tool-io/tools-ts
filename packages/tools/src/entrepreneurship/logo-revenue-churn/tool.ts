import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, positive, count } from "../shared.js";

export type Input = Readonly<{
  readonly startingCustomers: number;
  readonly lostCustomers: number;
  readonly startingRevenue: number;
  readonly lostRevenue: number;
}>;
export type Output = Readonly<{
  readonly logoChurnPercent: number;
  readonly revenueChurnPercent: number;
  readonly churnGapPoints: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.startingCustomers, "startingCustomers", 1);
  count(input.lostCustomers, "lostCustomers");
  positive(input.startingRevenue, "startingRevenue");
  nonnegative(input.lostRevenue, "lostRevenue");
  if (
    input.lostCustomers > input.startingCustomers ||
    input.lostRevenue > input.startingRevenue
  )
    simpleError(
      "lostCustomers",
      "Losses cannot exceed their starting cohort totals.",
    );
  const logoChurnPercent =
      (100 * input.lostCustomers) / input.startingCustomers,
    revenueChurnPercent = (100 * input.lostRevenue) / input.startingRevenue;
  return {
    logoChurnPercent,
    revenueChurnPercent,
    churnGapPoints: revenueChurnPercent - logoChurnPercent,
  };
};
export const exampleInput = {
  startingCustomers: 100,
  lostCustomers: 5,
  startingRevenue: 1000,
  lostRevenue: 100,
} satisfies Input;
export const exampleOutput = {
  logoChurnPercent: 5,
  revenueChurnPercent: 10,
  churnGapPoints: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/logo-revenue-churn",
  title: "Logo Revenue Churn",
  description:
    "Compare customer-logo churn with revenue churn from the same starting cohort.",
  inputs: [
    { id: "startingCustomers", label: "Starting customers", kind: "number" },
    { id: "lostCustomers", label: "Lost customers", kind: "number" },
    { id: "startingRevenue", label: "Starting revenue", kind: "number" },
    { id: "lostRevenue", label: "Lost revenue", kind: "number" },
  ],
  outputs: [
    { id: "logoChurnPercent", label: "Logo churn percent", kind: "number" },
    {
      id: "revenueChurnPercent",
      label: "Revenue churn percent",
      kind: "number",
    },
    { id: "churnGapPoints", label: "Churn gap points", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      startingCustomers: value.startingCustomers as number,
      lostCustomers: value.lostCustomers as number,
      startingRevenue: value.startingRevenue as number,
      lostRevenue: value.lostRevenue as number,
    }),
});
export const run = tool.execute;
export default tool;
