import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RevenueCutVouchingInput = {
  readonly transactions: ReadonlyArray<ReadonlyArray<number>>;
};

export type RevenueCutVouchingOutput = {
  readonly issueCount: number;
  readonly issueIndices: ReadonlyArray<number>;
  readonly testedCount: number;
};

export const testRevenueCutVouching = (
  input: RevenueCutVouchingInput,
): RevenueCutVouchingOutput => {
  if (!Array.isArray(input.transactions))
    simpleError(
      "transactions",
      "Transactions must be an array.",
      "transactions_required",
    );
  const issueIndices: number[] = [];
  for (const [index, transaction] of input.transactions.entries()) {
    if (!Array.isArray(transaction) || transaction.length !== 4)
      simpleError(
        `transactions.${index}`,
        "Each row must contain shipping date, invoice date, cutoff match, and invoice-after-shipping flags.",
        "invalid_transaction_row",
      );
    for (const [column, value] of transaction.entries())
      if (value !== 0 && value !== 1)
        simpleError(
          `transactions.${index}.${column}`,
          "Revenue-cut flags must be 0 or 1.",
          "invalid_transaction_flag",
        );
    if (
      transaction[0] !== 1 ||
      transaction[1] !== 1 ||
      transaction[2] !== 1 ||
      transaction[3] === 1
    )
      issueIndices.push(index);
  }
  return {
    issueCount: issueIndices.length,
    issueIndices,
    testedCount: input.transactions.length,
  };
};

export const revenueCutVouchingExample = {
  input: {
    transactions: [
      [1, 1, 1, 0],
      [1, 1, 0, 0],
      [1, 1, 1, 1],
    ],
  },
  output: { issueCount: 2, issueIndices: [1, 2], testedCount: 3 },
} satisfies ToolExample<RevenueCutVouchingInput, RevenueCutVouchingOutput>;

export const revenueCutVouchingTool = createSimpleTool({
  calculate: (input) =>
    testRevenueCutVouching({ transactions: input.transactions as number[][] }),
  description:
    "Identify revenue-cut transactions missing shipping or invoice dates, failing the cutoff-period test, or invoiced after shipment.",
  id: "auditing/revenue-cut-shipping-invoice-date-vouching-steps",
  inputs: [
    {
      description:
        "Rows ordered as shipping date present, invoice date present, cutoff period matched, and invoice after shipping flags.",
      id: "transactions",
      kind: "matrix",
      label: "Revenue-cut transactions",
    },
  ],
  outputs: [
    {
      id: "issueCount",
      kind: "integer",
      label: "Transaction issues",
      minimum: 0,
    },
    { id: "issueIndices", kind: "numberList", label: "Issue row indices" },
    {
      id: "testedCount",
      kind: "integer",
      label: "Transactions tested",
      minimum: 0,
    },
  ],
  title: "Revenue Cut Shipping Invoice Date Vouching Steps",
});

export const runRevenueCutVouching = revenueCutVouchingTool.execute;
export default revenueCutVouchingTool;
