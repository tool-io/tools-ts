import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedFee: number;
  readonly refundAmount: number;
};
export type Output = { readonly retainedFee: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedFee: { type: "number", minimum: 0 },
    refundAmount: { type: "number", minimum: 0 },
  },
  required: ["collectedFee", "refundAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { retainedFee: { type: "number" } },
  required: ["retainedFee"],
} as const;
/** Subtract an explicit refund from a collected administrative fee without selecting refund policy or clipping discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectedFee, refundAmount } = request;
  const compute = (): Output => {
    H.domain(collectedFee >= 0, "collectedFee");
    H.domain(refundAmount >= 0, "refundAmount");
    return { retainedFee: collectedFee - refundAmount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectedFee: 50, refundAmount: 15 },
  output: { retainedFee: 35 },
} satisfies ToolExample<Input, Output>;
export const administrativeFeeRefundResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/administrative-fee-refund-residual",
    title: "Administrative Fee Refund Residual",
    description:
      "Subtract an explicit refund from a collected administrative fee without selecting refund policy or clipping discrepancies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectedFee: { type: "number", minimum: 0 },
        refundAmount: { type: "number", minimum: 0 },
      },
      required: ["collectedFee", "refundAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { retainedFee: { type: "number" } },
      required: ["retainedFee"],
    },
    ports: {
      inputs: [
        {
          id: "collectedFee",
          label: "Collected Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refundAmount",
          label: "Refund Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedFee",
          label: "Retained Fee",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = administrativeFeeRefundResidualTool.execute;
export default administrativeFeeRefundResidualTool;
