import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ArCreditBalanceReviewInput = {
  readonly absoluteThreshold: number;
  readonly accountBalances: ReadonlyArray<number>;
  readonly ages: ReadonlyArray<number>;
};

export type ArCreditBalanceReviewOutput = {
  readonly flaggedCount: number;
  readonly flaggedIndices: ReadonlyArray<number>;
  readonly oldestFlaggedAgeDays: number;
  readonly totalCreditBalances: number;
};

export const reviewArCreditBalances = (
  input: ArCreditBalanceReviewInput,
): ArCreditBalanceReviewOutput => {
  if (!Number.isFinite(input.absoluteThreshold) || input.absoluteThreshold < 0)
    simpleError(
      "absoluteThreshold",
      "The absolute threshold must be finite and nonnegative.",
      "invalid_threshold",
    );
  if (!Array.isArray(input.accountBalances) || !Array.isArray(input.ages))
    simpleError(
      "",
      "Account balances and ages must be arrays.",
      "review_data_required",
    );
  if (input.accountBalances.length !== input.ages.length)
    simpleError(
      "ages",
      "Each account balance must have one age.",
      "review_data_length_mismatch",
    );
  const flaggedIndices: number[] = [];
  let oldestFlaggedAgeDays = 0;
  let totalCreditBalances = 0;
  for (const [index, balance] of input.accountBalances.entries()) {
    const age = input.ages[index]!;
    if (!Number.isFinite(balance))
      simpleError(
        `accountBalances.${index}`,
        "Account balances must be finite.",
        "invalid_account_balance",
      );
    if (!Number.isFinite(age) || age < 0)
      simpleError(
        `ages.${index}`,
        "Ages must be finite and nonnegative.",
        "invalid_age",
      );
    if (balance < 0 && Math.abs(balance) >= input.absoluteThreshold) {
      flaggedIndices.push(index);
      oldestFlaggedAgeDays = Math.max(oldestFlaggedAgeDays, age);
      const nextTotal = totalCreditBalances + Math.abs(balance);
      if (!Number.isFinite(nextTotal))
        simpleError(
          `accountBalances.${index}`,
          "The credit-balance total is not finite.",
          "result_not_finite",
        );
      totalCreditBalances = nextTotal;
    }
  }
  return {
    flaggedCount: flaggedIndices.length,
    flaggedIndices,
    oldestFlaggedAgeDays,
    totalCreditBalances,
  };
};

export const arCreditBalanceReviewExample = {
  input: {
    absoluteThreshold: 1_000,
    accountBalances: [-5_000, -200, 1_000],
    ages: [120, 30, 10],
  },
  output: {
    flaggedCount: 1,
    flaggedIndices: [0],
    oldestFlaggedAgeDays: 120,
    totalCreditBalances: 5_000,
  },
} satisfies ToolExample<
  ArCreditBalanceReviewInput,
  ArCreditBalanceReviewOutput
>;

export const arCreditBalanceReviewTool = createSimpleTool({
  calculate: (input) =>
    reviewArCreditBalances({
      absoluteThreshold: input.absoluteThreshold as number,
      accountBalances: input.accountBalances as number[],
      ages: input.ages as number[],
    }),
  description:
    "Identify negative accounts receivable balances at or above an absolute review threshold and summarize their count, total credit, and oldest age.",
  id: "auditing/ar-credit-balance-negative-account-review-procedure",
  inputs: [
    {
      description: "Minimum absolute credit balance selected for review.",
      id: "absoluteThreshold",
      kind: "number",
      label: "Absolute threshold",
      minimum: 0,
    },
    {
      description: "Signed ledger balance for each account.",
      id: "accountBalances",
      kind: "numberList",
      label: "Account balances",
    },
    {
      description: "Age in days corresponding to each account balance.",
      id: "ages",
      kind: "numberList",
      label: "Account ages",
    },
  ],
  outputs: [
    {
      id: "flaggedCount",
      kind: "integer",
      label: "Flagged accounts",
      minimum: 0,
    },
    { id: "flaggedIndices", kind: "numberList", label: "Flagged indices" },
    {
      id: "oldestFlaggedAgeDays",
      kind: "integer",
      label: "Oldest flagged age",
      minimum: 0,
      unit: "day",
    },
    {
      id: "totalCreditBalances",
      kind: "number",
      label: "Total credit balances",
      minimum: 0,
    },
  ],
  title: "AR Credit Balance Negative Account Review Procedure",
});

export const runArCreditBalanceReview = arCreditBalanceReviewTool.execute;
export default arCreditBalanceReviewTool;
