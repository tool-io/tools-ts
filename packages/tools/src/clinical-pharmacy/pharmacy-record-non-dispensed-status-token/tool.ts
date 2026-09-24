import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly status: string; readonly quantity: number };
export type Output = {
  readonly dispensed: boolean;
  readonly returned: boolean;
  readonly pending: boolean;
  readonly nonDispensedQuantity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["dispensed", "returned", "pending", "cancelled"],
    },
    quantity: { type: "integer", minimum: 0 },
  },
  required: ["status", "quantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dispensed: { type: "boolean" },
    returned: { type: "boolean" },
    pending: { type: "boolean" },
    nonDispensedQuantity: { type: "integer" },
  },
  required: ["dispensed", "returned", "pending", "nonDispensedQuantity"],
} as const;
/** Interpret a supplied inventory status vocabulary without inferring medication use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { status, quantity } = request;
  const compute = (): Output => {
    H.domain(
      ["dispensed", "returned", "pending", "cancelled"].includes(status),
      "status",
    );
    H.integer(quantity, 0);
    return {
      dispensed: status === "dispensed",
      returned: status === "returned",
      pending: status === "pending",
      nonDispensedQuantity: status === "dispensed" ? 0 : quantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { status: "pending", quantity: 20 },
  output: {
    dispensed: false,
    returned: false,
    pending: true,
    nonDispensedQuantity: 20,
  },
} satisfies ToolExample<Input, Output>;
export const pharmacyRecordNonDispensedStatusTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-pharmacy/pharmacy-record-non-dispensed-status-token",
      title: "Pharmacy Record Non Dispensed Status Token Tool",
      description:
        "Interpret a supplied inventory status vocabulary without inferring medication use.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          status: {
            type: "string",
            maxLength: 8192,
            enum: ["dispensed", "returned", "pending", "cancelled"],
          },
          quantity: { type: "integer", minimum: 0 },
        },
        required: ["status", "quantity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dispensed: { type: "boolean" },
          returned: { type: "boolean" },
          pending: { type: "boolean" },
          nonDispensedQuantity: { type: "integer" },
        },
        required: ["dispensed", "returned", "pending", "nonDispensedQuantity"],
      },
      ports: {
        inputs: [
          {
            id: "status",
            label: "Status",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "quantity",
            label: "Quantity",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "dispensed",
            label: "Dispensed",
            valueType: { type: "boolean" },
          },
          { id: "returned", label: "Returned", valueType: { type: "boolean" } },
          { id: "pending", label: "Pending", valueType: { type: "boolean" } },
          {
            id: "nonDispensedQuantity",
            label: "Non Dispensed Quantity",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacyRecordNonDispensedStatusTokenTool.execute;
export default pharmacyRecordNonDispensedStatusTokenTool;
