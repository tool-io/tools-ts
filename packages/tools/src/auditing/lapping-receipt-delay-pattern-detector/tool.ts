import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LappingPatternInput = {
  readonly maximumDelayDays: number;
  readonly paymentReceiptPairs: ReadonlyArray<ReadonlyArray<number>>;
};

export type LappingPatternOutput = {
  readonly patternCount: number;
  readonly suspiciousPairIndices: ReadonlyArray<number>;
  readonly valueAtRisk: number;
};

export const detectLappingPatterns = (
  input: LappingPatternInput,
): LappingPatternOutput => {
  if (
    !Number.isSafeInteger(input.maximumDelayDays) ||
    input.maximumDelayDays < 0
  )
    simpleError(
      "maximumDelayDays",
      "Maximum delay must be a nonnegative whole number of days.",
      "invalid_delay_window",
    );
  if (!Array.isArray(input.paymentReceiptPairs))
    simpleError(
      "paymentReceiptPairs",
      "Payment-receipt pairs must be an array.",
      "pair_data_required",
    );
  const suspiciousPairIndices: number[] = [];
  let valueAtRisk = 0;
  for (const [index, pair] of input.paymentReceiptPairs.entries()) {
    if (!Array.isArray(pair) || pair.length !== 4)
      simpleError(
        `paymentReceiptPairs.${index}`,
        "Each row must contain payment amount, receipt amount, delay days, and same-counterparty flag.",
        "invalid_pair_row",
      );
    const [paymentAmount, receiptAmount, delayDays, differentCustomer] = pair;
    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0)
      simpleError(
        `paymentReceiptPairs.${index}.0`,
        "Payment amount must be finite and positive.",
        "invalid_pair_amount",
      );
    if (!Number.isFinite(receiptAmount) || receiptAmount <= 0)
      simpleError(
        `paymentReceiptPairs.${index}.1`,
        "Receipt amount must be finite and positive.",
        "invalid_pair_amount",
      );
    if (!Number.isFinite(delayDays) || delayDays < 0)
      simpleError(
        `paymentReceiptPairs.${index}.2`,
        "Delay days must be finite and nonnegative.",
        "invalid_pair_delay",
      );
    if (differentCustomer !== 0 && differentCustomer !== 1)
      simpleError(
        `paymentReceiptPairs.${index}.3`,
        "Different-customer flag must be 0 or 1.",
        "invalid_pair_flag",
      );
    if (
      differentCustomer === 1 &&
      delayDays <= input.maximumDelayDays &&
      paymentAmount === receiptAmount
    ) {
      suspiciousPairIndices.push(index);
      valueAtRisk += receiptAmount;
      if (!Number.isFinite(valueAtRisk))
        simpleError(
          `paymentReceiptPairs.${index}.1`,
          "The value at risk is not finite.",
          "result_not_finite",
        );
    }
  }
  return {
    patternCount: suspiciousPairIndices.length,
    suspiciousPairIndices,
    valueAtRisk,
  };
};

export const lappingPatternExample = {
  input: {
    maximumDelayDays: 10,
    paymentReceiptPairs: [
      [10_000, 10_000, 3, 1],
      [5_000, 4_900, 2, 1],
      [2_000, 2_000, 12, 1],
    ],
  },
  output: {
    patternCount: 1,
    suspiciousPairIndices: [0],
    valueAtRisk: 10_000,
  },
} satisfies ToolExample<LappingPatternInput, LappingPatternOutput>;

export const lappingPatternTool = createSimpleTool({
  calculate: (input) =>
    detectLappingPatterns({
      maximumDelayDays: input.maximumDelayDays as number,
      paymentReceiptPairs: input.paymentReceiptPairs as number[][],
    }),
  description:
    "Flag equal-value receipts associated with different customer accounts inside a caller-selected posting-delay window for follow-up as possible lapping patterns. A match is an investigative lead, not proof of fraud.",
  id: "auditing/lapping-receipt-delay-pattern-detector",
  inputs: [
    {
      description: "Maximum whole-day delay used for pattern screening.",
      id: "maximumDelayDays",
      kind: "integer",
      label: "Maximum delay days",
      minimum: 0,
    },
    {
      description:
        "Rows ordered as first receipt amount, later receipt amount, posting delay days, and different-customer flag (0 or 1).",
      id: "paymentReceiptPairs",
      kind: "matrix",
      label: "Payment receipt pairs",
    },
  ],
  outputs: [
    {
      id: "patternCount",
      kind: "integer",
      label: "Potential patterns",
      minimum: 0,
    },
    {
      id: "suspiciousPairIndices",
      kind: "numberList",
      label: "Potential pattern indices",
    },
    { id: "valueAtRisk", kind: "number", label: "Value at risk", minimum: 0 },
  ],
  title: "Lapping Receipt Delay Pattern Detector",
});

export const runLappingPattern = lappingPatternTool.execute;
export default lappingPatternTool;
