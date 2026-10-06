import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossValue: number;
  readonly suppliedDeduction: number;
};
export type Output = { readonly netValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossValue: { type: "number", minimum: 0 },
    suppliedDeduction: { type: "number", minimum: 0 },
  },
  required: ["grossValue", "suppliedDeduction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netValue: { type: "number" } },
  required: ["netValue"],
} as const;
/** Subtract an explicit grade-related deduction amount from crop delivery value without determining grade or deduction schedules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossValue, suppliedDeduction } = request;
  const compute = (): Output => {
    H.domain(grossValue >= 0, "grossValue");
    H.domain(suppliedDeduction >= 0, "suppliedDeduction");
    return { netValue: grossValue - suppliedDeduction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossValue: 1200, suppliedDeduction: 75 },
  output: { netValue: 1125 },
} satisfies ToolExample<Input, Output>;
export const cropDeliveryGradeDeductionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/crop-delivery-grade-deduction",
    title: "Crop Delivery Grade Deduction",
    description:
      "Subtract an explicit grade-related deduction amount from crop delivery value without determining grade or deduction schedules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossValue: { type: "number", minimum: 0 },
        suppliedDeduction: { type: "number", minimum: 0 },
      },
      required: ["grossValue", "suppliedDeduction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netValue: { type: "number" } },
      required: ["netValue"],
    },
    ports: {
      inputs: [
        {
          id: "grossValue",
          label: "Gross Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDeduction",
          label: "Supplied Deduction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netValue", label: "Net Value", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cropDeliveryGradeDeductionTool.execute;
export default cropDeliveryGradeDeductionTool;
