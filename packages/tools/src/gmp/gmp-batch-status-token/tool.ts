import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly batchId: string; readonly status: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    batchId: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: [
        "planned",
        "in-process",
        "held",
        "released",
        "rejected",
        "unspecified",
      ],
    },
  },
  required: ["batchId", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit manufacturing batch status without certifying release or GMP compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { batchId, status } = request;
  const compute = (): Output => {
    H.domain(batchId.length > 0, "batchId");
    H.domain(
      [
        "planned",
        "in-process",
        "held",
        "released",
        "rejected",
        "unspecified",
      ].includes(status),
      "status",
    );
    return { label: batchId + " [" + status + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { batchId: "B17", status: "held" },
  output: { label: "B17 [held]" },
} satisfies ToolExample<Input, Output>;
export const gmpBatchStatusTokenTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "gmp",
          "good manufacturing practice",
          "research and quality management",
        ],
        keywords: [
          "good manufacturing practice",
          "research and quality management",
          "GMP",
        ],
      },
      id: "gmp/gmp-batch-status-token",
      title: "GMP Batch Status Token",
      description:
        "Label an explicit manufacturing batch status without certifying release or GMP compliance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          batchId: { type: "string", maxLength: 8192, minLength: 1 },
          status: {
            type: "string",
            maxLength: 8192,
            enum: [
              "planned",
              "in-process",
              "held",
              "released",
              "rejected",
              "unspecified",
            ],
          },
        },
        required: ["batchId", "status"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "batchId",
            label: "Batch Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "status",
            label: "Status",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  },
);
export const run = gmpBatchStatusTokenTool.execute;
export default gmpBatchStatusTokenTool;
