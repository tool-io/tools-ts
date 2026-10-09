import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transferredEntitlement: number;
  readonly totalEntitlement: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transferredEntitlement: { type: "number", minimum: 0 },
    totalEntitlement: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["transferredEntitlement", "totalEntitlement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize an explicit transferred entitlement amount to compatible total recorded entitlement without deciding eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transferredEntitlement, totalEntitlement } = request;
  const compute = (): Output => {
    (H.domain(totalEntitlement > 0, "totalEntitlement"), totalEntitlement);
    H.domain(
      transferredEntitlement >= 0 && transferredEntitlement <= totalEntitlement,
      "transferredEntitlement",
    );
    return {
      fraction: transferredEntitlement / totalEntitlement,
      remainder: totalEntitlement - transferredEntitlement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { transferredEntitlement: 30, totalEntitlement: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const foodAidHouseholdEntitlementTransferShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["food-security", "food security", "agriculture"],
        keywords: ["food security", "agriculture"],
      },
      id: "food-security/food-aid-household-entitlement-transfer-share",
      title: "Food Aid Household Entitlement Transfer Share",
      description:
        "Normalize an explicit transferred entitlement amount to compatible total recorded entitlement without deciding eligibility.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          transferredEntitlement: { type: "number", minimum: 0 },
          totalEntitlement: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["transferredEntitlement", "totalEntitlement"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fraction: { type: "number" },
          remainder: { type: "number" },
        },
        required: ["fraction", "remainder"],
      },
      ports: {
        inputs: [
          {
            id: "transferredEntitlement",
            label: "Transferred Entitlement",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalEntitlement",
            label: "Total Entitlement",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "remainder",
            label: "Remainder",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodAidHouseholdEntitlementTransferShareTool.execute;
export default foodAidHouseholdEntitlementTransferShareTool;
