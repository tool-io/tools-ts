import { parsePlainDate, millisecondsPerDay } from "../../core/date.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  SimpleToolError,
  simpleError,
} from "../../core/simple.js";

export type DisbursementReviewWindowInput = {
  readonly balanceDate: string;
  readonly payments: ReadonlyArray<ReadonlyArray<number>>;
  readonly searchEndDate: string;
  readonly windowDays: number;
};

export type DisbursementReviewWindowOutput = {
  readonly inWindowCount: number;
  readonly inWindowIndices: ReadonlyArray<number>;
  readonly inWindowTotal: number;
  readonly outsideWindowCount: number;
};

export const reviewPostdatedCheckWindow = (
  input: DisbursementReviewWindowInput,
): DisbursementReviewWindowOutput => {
  let balanceTimestamp = 0;
  let endTimestamp = 0;
  try {
    balanceTimestamp = parsePlainDate(input.balanceDate, "balanceDate");
    endTimestamp = parsePlainDate(input.searchEndDate, "searchEndDate");
  } catch (error) {
    if (error instanceof SimpleToolError)
      simpleError(error.field, error.message, "invalid_review_date");
    throw error;
  }
  if (endTimestamp < balanceTimestamp)
    simpleError(
      "searchEndDate",
      "The search end date must not precede the balance date.",
      "invalid_review_window",
    );
  if (!Number.isSafeInteger(input.windowDays) || input.windowDays < 0)
    simpleError(
      "windowDays",
      "The review window must be a nonnegative whole number of days.",
      "invalid_window_days",
    );
  if (!Array.isArray(input.payments))
    simpleError("payments", "Payments must be an array.", "payments_required");
  const inWindowIndices: number[] = [];
  let inWindowTotal = 0;
  for (const [index, payment] of input.payments.entries()) {
    if (!Array.isArray(payment) || payment.length !== 2)
      simpleError(
        `payments.${index}`,
        "Each payment must contain days after balance date and amount.",
        "invalid_payment_row",
      );
    const [daysAfterBalance, amount] = payment;
    if (!Number.isFinite(daysAfterBalance) || daysAfterBalance < 0)
      simpleError(
        `payments.${index}.0`,
        "Payment day offset must be nonnegative.",
        "invalid_payment_day",
      );
    if (!Number.isFinite(amount) || amount <= 0)
      simpleError(
        `payments.${index}.1`,
        "Payment amount must be positive.",
        "invalid_payment_amount",
      );
    if (
      daysAfterBalance <= input.windowDays &&
      balanceTimestamp + daysAfterBalance * millisecondsPerDay <= endTimestamp
    ) {
      inWindowIndices.push(index);
      inWindowTotal += amount;
      if (!Number.isFinite(inWindowTotal))
        simpleError(
          `payments.${index}.1`,
          "The payment total is not finite.",
          "result_not_finite",
        );
    }
  }
  return {
    inWindowCount: inWindowIndices.length,
    inWindowIndices,
    inWindowTotal,
    outsideWindowCount: input.payments.length - inWindowIndices.length,
  };
};

export const disbursementReviewWindowExample = {
  input: {
    balanceDate: "2026-01-31",
    payments: [
      [1, 5_000],
      [20, 7_000],
      [45, 9_000],
    ],
    searchEndDate: "2026-03-15",
    windowDays: 30,
  },
  output: {
    inWindowCount: 2,
    inWindowIndices: [0, 1],
    inWindowTotal: 12_000,
    outsideWindowCount: 1,
  },
} satisfies ToolExample<
  DisbursementReviewWindowInput,
  DisbursementReviewWindowOutput
>;

export const disbursementReviewWindowTool = createSimpleTool({
  calculate: (input) =>
    reviewPostdatedCheckWindow({
      balanceDate: input.balanceDate as string,
      payments: input.payments as number[][],
      searchEndDate: input.searchEndDate as string,
      windowDays: input.windowDays as number,
    }),
  description:
    "Classify subsequent cash payments inside or outside a caller-selected post-balance-date review window bounded by explicit dates.",
  id: "auditing/subsequent-disbursement-postdated-check-review-window",
  inputs: [
    { id: "balanceDate", kind: "string", label: "Balance date" },
    {
      description:
        "Rows ordered as whole days after balance date and positive amount.",
      id: "payments",
      kind: "matrix",
      label: "Subsequent payments",
    },
    { id: "searchEndDate", kind: "string", label: "Search end date" },
    { id: "windowDays", kind: "integer", label: "Window days", minimum: 0 },
  ],
  outputs: [
    {
      id: "inWindowCount",
      kind: "integer",
      label: "Payments in window",
      minimum: 0,
    },
    { id: "inWindowIndices", kind: "numberList", label: "In-window indices" },
    {
      id: "inWindowTotal",
      kind: "number",
      label: "In-window total",
      minimum: 0,
    },
    {
      id: "outsideWindowCount",
      kind: "integer",
      label: "Payments outside window",
      minimum: 0,
    },
  ],
  title: "Subsequent Disbursement Postdated Check Review Window",
});

export const runDisbursementReviewWindow = disbursementReviewWindowTool.execute;
export default disbursementReviewWindowTool;
