import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedActive: number;
  readonly excludedCustomers: number;
};
export type Output = { readonly adjustedActive: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedActive: { type: "integer", minimum: 0 },
    excludedCustomers: { type: "integer", minimum: 0 },
  },
  required: ["recordedActive", "excludedCustomers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjustedActive: { type: "integer" } },
  required: ["adjustedActive"],
} as const;
/** Subtract a supplied customer exclusion count from recorded active customers, preserving reconciliation discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedActive, excludedCustomers } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(recordedActive) &&
        recordedActive >= 0 &&
        recordedActive <= Number.MAX_SAFE_INTEGER,
      "recordedActive",
    ),
      recordedActive);
    (H.domain(
      Number.isSafeInteger(excludedCustomers) &&
        excludedCustomers >= 0 &&
        excludedCustomers <= Number.MAX_SAFE_INTEGER,
      "excludedCustomers",
    ),
      excludedCustomers);
    return { adjustedActive: recordedActive - excludedCustomers };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedActive: 100, excludedCustomers: 12 },
  output: { adjustedActive: 88 },
} satisfies ToolExample<Input, Output>;
export const activeCustomerExclusionAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/active-customer-exclusion-adjustment",
    title: "Active Customer Exclusion Adjustment",
    description:
      "Subtract a supplied customer exclusion count from recorded active customers, preserving reconciliation discrepancies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedActive: { type: "integer", minimum: 0 },
        excludedCustomers: { type: "integer", minimum: 0 },
      },
      required: ["recordedActive", "excludedCustomers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { adjustedActive: { type: "integer" } },
      required: ["adjustedActive"],
    },
    ports: {
      inputs: [
        {
          id: "recordedActive",
          label: "Recorded Active",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedCustomers",
          label: "Excluded Customers",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "adjustedActive",
          label: "Adjusted Active",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = activeCustomerExclusionAdjustmentTool.execute;
export default activeCustomerExclusionAdjustmentTool;
