import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly complaintId: string;
  readonly productId: string;
  readonly batchId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    complaintId: { type: "string", maxLength: 8192, minLength: 1 },
    productId: { type: "string", maxLength: 8192, minLength: 1 },
    batchId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["complaintId", "productId", "batchId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit complaint by product and batch identifiers without determining causality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { complaintId, productId, batchId } = request;
  const compute = (): Output => {
    H.domain(complaintId.length > 0, "complaintId");
    H.domain(productId.length > 0, "productId");
    H.domain(batchId.length > 0, "batchId");
    return { token: JSON.stringify([complaintId, productId, batchId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { complaintId: "COMP17", productId: "PR2", batchId: "B2" },
  output: { token: '["COMP17","PR2","B2"]' },
} satisfies ToolExample<Input, Output>;
export const qualityComplaintBatchReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-assurance",
        "quality assurance",
        "research and quality management",
      ],
      keywords: ["quality assurance", "research and quality management"],
    },
    id: "quality-assurance/quality-complaint-batch-reference",
    title: "Quality Complaint Batch Reference",
    description:
      "Qualify an explicit complaint by product and batch identifiers without determining causality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        complaintId: { type: "string", maxLength: 8192, minLength: 1 },
        productId: { type: "string", maxLength: 8192, minLength: 1 },
        batchId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["complaintId", "productId", "batchId"],
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
          id: "complaintId",
          label: "Complaint Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "productId",
          label: "Product Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "batchId",
          label: "Batch Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = qualityComplaintBatchReferenceTool.execute;
export default qualityComplaintBatchReferenceTool;
