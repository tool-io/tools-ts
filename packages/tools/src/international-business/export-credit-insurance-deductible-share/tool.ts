import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleLoss: number;
  readonly deductible: number;
  readonly insuredFraction: number;
  readonly policyLimit: number;
};
export type Output = {
  readonly afterDeductible: number;
  readonly reimbursement: number;
  readonly retainedLoss: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleLoss: { type: "number", minimum: 0 },
    deductible: { type: "number", minimum: 0 },
    insuredFraction: { type: "number", minimum: 0, maximum: 1 },
    policyLimit: { type: "number", minimum: 0 },
  },
  required: ["eligibleLoss", "deductible", "insuredFraction", "policyLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    afterDeductible: { type: "number" },
    reimbursement: { type: "number" },
    retainedLoss: { type: "number" },
  },
  required: ["afterDeductible", "reimbursement", "retainedLoss"],
} as const;
/** Caller-defined deductible-then-coinsurance reimbursement with a payout cap; no insurance coverage interpretation is made. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleLoss, deductible, insuredFraction, policyLimit } = request;
  const compute = (): Output => {
    H.domain(eligibleLoss >= 0 && deductible >= 0 && policyLimit >= 0);
    H.probability(insuredFraction);
    return {
      afterDeductible: Math.max(0, eligibleLoss - deductible),
      reimbursement: Math.min(
        policyLimit,
        Math.max(0, eligibleLoss - deductible) * insuredFraction,
      ),
      retainedLoss:
        eligibleLoss -
        Math.min(
          policyLimit,
          Math.max(0, eligibleLoss - deductible) * insuredFraction,
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleLoss: 10000,
    deductible: 1000,
    insuredFraction: 0.9,
    policyLimit: 20000,
  },
  output: { afterDeductible: 9000, reimbursement: 8100, retainedLoss: 1900 },
} satisfies ToolExample<Input, Output>;
export const exportCreditInsuranceDeductibleShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-business/export-credit-insurance-deductible-share",
      title: "Export Credit Insurance Deductible Share Tool",
      description:
        "Caller-defined deductible-then-coinsurance reimbursement with a payout cap; no insurance coverage interpretation is made.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleLoss: { type: "number", minimum: 0 },
          deductible: { type: "number", minimum: 0 },
          insuredFraction: { type: "number", minimum: 0, maximum: 1 },
          policyLimit: { type: "number", minimum: 0 },
        },
        required: [
          "eligibleLoss",
          "deductible",
          "insuredFraction",
          "policyLimit",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          afterDeductible: { type: "number" },
          reimbursement: { type: "number" },
          retainedLoss: { type: "number" },
        },
        required: ["afterDeductible", "reimbursement", "retainedLoss"],
      },
      ports: {
        inputs: [
          {
            id: "eligibleLoss",
            label: "Eligible Loss",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deductible",
            label: "Deductible",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "insuredFraction",
            label: "Insured Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "policyLimit",
            label: "Policy Limit",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "afterDeductible",
            label: "After Deductible",
            valueType: { type: "number" },
          },
          {
            id: "reimbursement",
            label: "Reimbursement",
            valueType: { type: "number" },
          },
          {
            id: "retainedLoss",
            label: "Retained Loss",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = exportCreditInsuranceDeductibleShareTool.execute;
export default exportCreditInsuranceDeductibleShareTool;
