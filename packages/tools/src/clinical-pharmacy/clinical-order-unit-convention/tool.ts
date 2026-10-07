import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly orderId: string;
  readonly quantityUnit: string;
  readonly conventionSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderId: { type: "string", maxLength: 8192, minLength: 1 },
    quantityUnit: { type: "string", maxLength: 8192, minLength: 1 },
    conventionSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["orderId", "quantityUnit", "conventionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit order unit convention without interpreting or converting a medication order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orderId, quantityUnit, conventionSource } = request;
  const compute = (): Output => {
    H.domain(orderId.length > 0, "orderId");
    H.domain(quantityUnit.length > 0, "quantityUnit");
    H.domain(conventionSource.length > 0, "conventionSource");
    return { token: JSON.stringify([orderId, quantityUnit, conventionSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    orderId: "O17",
    quantityUnit: "mg",
    conventionSource: "Order system A",
  },
  output: { token: '["O17","mg","Order system A"]' },
} satisfies ToolExample<Input, Output>;
export const clinicalOrderUnitConventionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["clinical-pharmacy", "clinical pharmacy", "pharmacy"],
      keywords: ["clinical pharmacy", "pharmacy"],
    },
    id: "clinical-pharmacy/clinical-order-unit-convention",
    title: "Clinical Order Unit Convention",
    description:
      "Preserve an explicit order unit convention without interpreting or converting a medication order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderId: { type: "string", maxLength: 8192, minLength: 1 },
        quantityUnit: { type: "string", maxLength: 8192, minLength: 1 },
        conventionSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["orderId", "quantityUnit", "conventionSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "orderId",
          label: "Order Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "quantityUnit",
          label: "Quantity Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "conventionSource",
          label: "Convention Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = clinicalOrderUnitConventionTool.execute;
export default clinicalOrderUnitConventionTool;
