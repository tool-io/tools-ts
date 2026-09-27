import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligiblePurchase: number;
  readonly benefitAvailable: number;
  readonly requiredCopayment: number;
};
export type Output = {
  readonly benefitUsed: number;
  readonly householdPayment: number;
  readonly unusedBenefit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligiblePurchase: { type: "number", minimum: 0 },
    benefitAvailable: { type: "number", minimum: 0 },
    requiredCopayment: { type: "number", minimum: 0 },
  },
  required: ["eligiblePurchase", "benefitAvailable", "requiredCopayment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    benefitUsed: { type: "number" },
    householdPayment: { type: "number" },
    unusedBenefit: { type: "number" },
  },
  required: ["benefitUsed", "householdPayment", "unusedBenefit"],
} as const;
/** Calculate nutrition assistance copayment balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligiblePurchase, benefitAvailable, requiredCopayment } = request;
  const compute = (): Output => {
    H.domain(
      eligiblePurchase >= 0 &&
        benefitAvailable >= 0 &&
        requiredCopayment >= 0 &&
        requiredCopayment <= eligiblePurchase,
    );
    return {
      benefitUsed: Math.min(
        benefitAvailable,
        eligiblePurchase - requiredCopayment,
      ),
      householdPayment:
        eligiblePurchase -
        Math.min(benefitAvailable, eligiblePurchase - requiredCopayment),
      unusedBenefit:
        benefitAvailable -
        Math.min(benefitAvailable, eligiblePurchase - requiredCopayment),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligiblePurchase: 100, benefitAvailable: 80, requiredCopayment: 30 },
  output: { benefitUsed: 70, householdPayment: 30, unusedBenefit: 10 },
} satisfies ToolExample<Input, Output>;
export const nutritionAssistanceCopaymentBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-security/nutrition-assistance-copayment-balance",
      title: "Nutrition Assistance Copayment Balance Tool",
      description:
        "Calculate nutrition assistance copayment balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligiblePurchase: { type: "number", minimum: 0 },
          benefitAvailable: { type: "number", minimum: 0 },
          requiredCopayment: { type: "number", minimum: 0 },
        },
        required: ["eligiblePurchase", "benefitAvailable", "requiredCopayment"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          benefitUsed: { type: "number" },
          householdPayment: { type: "number" },
          unusedBenefit: { type: "number" },
        },
        required: ["benefitUsed", "householdPayment", "unusedBenefit"],
      },
      ports: {
        inputs: [
          {
            id: "eligiblePurchase",
            label: "Eligible Purchase",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "benefitAvailable",
            label: "Benefit Available",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "requiredCopayment",
            label: "Required Copayment",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "benefitUsed",
            label: "Benefit Used",
            valueType: { type: "number" },
          },
          {
            id: "householdPayment",
            label: "Household Payment",
            valueType: { type: "number" },
          },
          {
            id: "unusedBenefit",
            label: "Unused Benefit",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = nutritionAssistanceCopaymentBalanceTool.execute;
export default nutritionAssistanceCopaymentBalanceTool;
