import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SubsequentDisbursementInput = {
  readonly payments: ReadonlyArray<ReadonlyArray<number>>;
};

export type SubsequentDisbursementOutput = {
  readonly possibleUnrecordedCount: number;
  readonly possibleUnrecordedIndices: ReadonlyArray<number>;
  readonly possibleUnrecordedTotal: number;
  readonly paymentsSearched: number;
};

export const searchUnrecordedLiabilities = (
  input: SubsequentDisbursementInput,
): SubsequentDisbursementOutput => {
  if (!Array.isArray(input.payments))
    simpleError("payments", "Payments must be an array.", "payments_required");
  const possibleUnrecordedIndices: number[] = [];
  let possibleUnrecordedTotal = 0;
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
        "Days after balance date must be nonnegative.",
        "invalid_payment_day",
      );
    if (!Number.isFinite(amount) || amount <= 0)
      simpleError(
        `payments.${index}.1`,
        "Payment amount must be finite and positive.",
        "invalid_payment_amount",
      );
    if (daysAfterBalance === 0) {
      possibleUnrecordedIndices.push(index);
      possibleUnrecordedTotal += amount;
      if (!Number.isFinite(possibleUnrecordedTotal))
        simpleError(
          `payments.${index}.1`,
          "The possible-liability total is not finite.",
          "result_not_finite",
        );
    }
  }
  return {
    possibleUnrecordedCount: possibleUnrecordedIndices.length,
    possibleUnrecordedIndices,
    possibleUnrecordedTotal,
    paymentsSearched: input.payments.length,
  };
};

export const subsequentDisbursementExample = {
  input: {
    payments: [
      [0, 12_000],
      [1, 4_000],
      [0, 7_500],
    ],
  },
  output: {
    possibleUnrecordedCount: 2,
    possibleUnrecordedIndices: [0, 2],
    possibleUnrecordedTotal: 19_500,
    paymentsSearched: 3,
  },
} satisfies ToolExample<
  SubsequentDisbursementInput,
  SubsequentDisbursementOutput
>;

export const subsequentDisbursementTool = createSimpleTool({
  calculate: (input) =>
    searchUnrecordedLiabilities({ payments: input.payments as number[][] }),
  description:
    "Search supplied subsequent payments for items dated on the balance date that were not matched to a recorded liability and total their possible unrecorded exposure.",
  id: "auditing/unrecorded-liabilities-subsequent-disbursements-search-procedure",
  inputs: [
    {
      description:
        "Rows ordered as whole days after the balance date and positive payment amount.",
      id: "payments",
      kind: "matrix",
      label: "Subsequent payments",
    },
  ],
  outputs: [
    {
      id: "possibleUnrecordedCount",
      kind: "integer",
      label: "Possible unrecorded items",
      minimum: 0,
    },
    {
      id: "possibleUnrecordedIndices",
      kind: "numberList",
      label: "Possible unrecorded indices",
    },
    {
      id: "possibleUnrecordedTotal",
      kind: "number",
      label: "Possible unrecorded total",
      minimum: 0,
    },
    {
      id: "paymentsSearched",
      kind: "integer",
      label: "Payments searched",
      minimum: 0,
    },
  ],
  title: "Unrecorded Liabilities Subsequent Disbursements Search Procedure",
});

export const runSubsequentDisbursement = subsequentDisbursementTool.execute;
export default subsequentDisbursementTool;
