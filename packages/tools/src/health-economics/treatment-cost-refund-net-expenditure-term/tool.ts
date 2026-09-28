import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly treated: number;
  readonly pricePerTreatment: number;
  readonly refundedFraction: number;
  readonly rebatePerRefund: number;
  readonly administrationCost: number;
};
export type Output = {
  readonly grossCost: number;
  readonly expectedRefund: number;
  readonly netCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    treated: { type: "integer", minimum: 0 },
    pricePerTreatment: { type: "number", minimum: 0 },
    refundedFraction: { type: "number", minimum: 0, maximum: 1 },
    rebatePerRefund: { type: "number", minimum: 0 },
    administrationCost: { type: "number", minimum: 0 },
  },
  required: [
    "treated",
    "pricePerTreatment",
    "refundedFraction",
    "rebatePerRefund",
    "administrationCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossCost: { type: "number" },
    expectedRefund: { type: "number" },
    netCost: { type: "number" },
  },
  required: ["grossCost", "expectedRefund", "netCost"],
} as const;
/** Expected outcome-linked rebate arithmetic from supplied eligible fractions, not a reimbursement policy interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    treated,
    pricePerTreatment,
    refundedFraction,
    rebatePerRefund,
    administrationCost,
  } = request;
  const compute = (): Output => {
    H.integer(treated, 0);
    H.probability(refundedFraction);
    H.domain(
      pricePerTreatment >= 0 && rebatePerRefund >= 0 && administrationCost >= 0,
    );
    return {
      grossCost: treated * pricePerTreatment,
      expectedRefund: treated * refundedFraction * rebatePerRefund,
      netCost:
        treated * pricePerTreatment -
        treated * refundedFraction * rebatePerRefund +
        administrationCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    treated: 100,
    pricePerTreatment: 500,
    refundedFraction: 0.2,
    rebatePerRefund: 300,
    administrationCost: 1000,
  },
  output: { grossCost: 50000, expectedRefund: 6000, netCost: 45000 },
} satisfies ToolExample<Input, Output>;
export const treatmentCostRefundNetExpenditureTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-economics/treatment-cost-refund-net-expenditure-term",
      title: "Treatment Cost Refund Net Expenditure Term Tool",
      description:
        "Expected outcome-linked rebate arithmetic from supplied eligible fractions, not a reimbursement policy interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          treated: { type: "integer", minimum: 0 },
          pricePerTreatment: { type: "number", minimum: 0 },
          refundedFraction: { type: "number", minimum: 0, maximum: 1 },
          rebatePerRefund: { type: "number", minimum: 0 },
          administrationCost: { type: "number", minimum: 0 },
        },
        required: [
          "treated",
          "pricePerTreatment",
          "refundedFraction",
          "rebatePerRefund",
          "administrationCost",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossCost: { type: "number" },
          expectedRefund: { type: "number" },
          netCost: { type: "number" },
        },
        required: ["grossCost", "expectedRefund", "netCost"],
      },
      ports: {
        inputs: [
          {
            id: "treated",
            label: "Treated",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "pricePerTreatment",
            label: "Price Per Treatment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "refundedFraction",
            label: "Refunded Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rebatePerRefund",
            label: "Rebate Per Refund",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "administrationCost",
            label: "Administration Cost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "grossCost",
            label: "Gross Cost",
            valueType: { type: "number" },
          },
          {
            id: "expectedRefund",
            label: "Expected Refund",
            valueType: { type: "number" },
          },
          { id: "netCost", label: "Net Cost", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = treatmentCostRefundNetExpenditureTermTool.execute;
export default treatmentCostRefundNetExpenditureTermTool;
