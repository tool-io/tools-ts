import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalCharge: number;
  readonly cancellationFee: number;
  readonly deposit: number;
  readonly otherCredit: number;
};
export type Output = { readonly balanceDue: number; readonly refund: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalCharge: { type: "number", minimum: 0 },
    cancellationFee: { type: "number", minimum: 0 },
    deposit: { type: "number", minimum: 0 },
    otherCredit: { type: "number", minimum: 0 },
  },
  required: ["originalCharge", "cancellationFee", "deposit", "otherCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { balanceDue: { type: "number" }, refund: { type: "number" } },
  required: ["balanceDue", "refund"],
} as const;
/** Reconcile explicit retained charges, cancellation fees, deposits and credits; no cancellation policy is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalCharge, cancellationFee, deposit, otherCredit } = request;
  const compute = (): Output => {
    H.domain(
      originalCharge >= 0 &&
        cancellationFee >= 0 &&
        deposit >= 0 &&
        otherCredit >= 0,
    );
    return {
      balanceDue: Math.max(
        0,
        originalCharge + cancellationFee - deposit - otherCredit,
      ),
      refund: Math.max(
        0,
        deposit + otherCredit - originalCharge - cancellationFee,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalCharge: 100,
    cancellationFee: 20,
    deposit: 50,
    otherCredit: 10,
  },
  output: { balanceDue: 60, refund: 0 },
} satisfies ToolExample<Input, Output>;
export const balanceDueDepositCancellationCreditTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hospitality/balance-due-deposit-cancellation-credit",
      title: "Balance Due Deposit Cancellation Credit Tool",
      description:
        "Reconcile explicit retained charges, cancellation fees, deposits and credits; no cancellation policy is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalCharge: { type: "number", minimum: 0 },
          cancellationFee: { type: "number", minimum: 0 },
          deposit: { type: "number", minimum: 0 },
          otherCredit: { type: "number", minimum: 0 },
        },
        required: [
          "originalCharge",
          "cancellationFee",
          "deposit",
          "otherCredit",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          balanceDue: { type: "number" },
          refund: { type: "number" },
        },
        required: ["balanceDue", "refund"],
      },
      ports: {
        inputs: [
          {
            id: "originalCharge",
            label: "Original Charge",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cancellationFee",
            label: "Cancellation Fee",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deposit",
            label: "Deposit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "otherCredit",
            label: "Other Credit",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "balanceDue",
            label: "Balance Due",
            valueType: { type: "number" },
          },
          { id: "refund", label: "Refund", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = balanceDueDepositCancellationCreditTool.execute;
export default balanceDueDepositCancellationCreditTool;
