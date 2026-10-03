import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly submitted: number;
  readonly receiptTimestamp: number;
  readonly sourceOffset: number;
  readonly receiptOffset: number;
};
export type Output = { readonly rawLag: number; readonly referenceLag: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    submitted: { type: "number" },
    receiptTimestamp: { type: "number" },
    sourceOffset: { type: "number" },
    receiptOffset: { type: "number" },
  },
  required: ["submitted", "receiptTimestamp", "sourceOffset", "receiptOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rawLag: { type: "number" }, referenceLag: { type: "number" } },
  required: ["rawLag", "referenceLag"],
} as const;
/** Compare explicit submission/receipt clocks after supplied common-reference offsets. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { submitted, receiptTimestamp, sourceOffset, receiptOffset } = request;
  const compute = (): Output => {
    return {
      rawLag: receiptTimestamp - submitted,
      referenceLag: receiptTimestamp - receiptOffset - submitted + sourceOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    submitted: 100,
    receiptTimestamp: 110,
    sourceOffset: 2,
    receiptOffset: -1,
  },
  output: { rawLag: 10, referenceLag: 13 },
} satisfies ToolExample<Input, Output>;
export const authorityReceiptSubmissionTimeOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "regulatory-affairs/authority-receipt-submission-time-offset",
      title: "Authority Receipt Submission Time Offset Tool",
      description:
        "Compare explicit submission/receipt clocks after supplied common-reference offsets.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          submitted: { type: "number" },
          receiptTimestamp: { type: "number" },
          sourceOffset: { type: "number" },
          receiptOffset: { type: "number" },
        },
        required: [
          "submitted",
          "receiptTimestamp",
          "sourceOffset",
          "receiptOffset",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawLag: { type: "number" },
          referenceLag: { type: "number" },
        },
        required: ["rawLag", "referenceLag"],
      },
      ports: {
        inputs: [
          {
            id: "submitted",
            label: "Submitted",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "receiptTimestamp",
            label: "Receipt Timestamp",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sourceOffset",
            label: "Source Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "receiptOffset",
            label: "Receipt Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "rawLag", label: "Raw Lag", valueType: { type: "number" } },
          {
            id: "referenceLag",
            label: "Reference Lag",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = authorityReceiptSubmissionTimeOffsetTool.execute;
export default authorityReceiptSubmissionTimeOffsetTool;
