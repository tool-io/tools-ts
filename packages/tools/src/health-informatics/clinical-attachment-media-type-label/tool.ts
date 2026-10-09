import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attachmentId: string;
  readonly suppliedMediaType: string;
  readonly sourceRecord: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attachmentId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedMediaType: { type: "string", maxLength: 8192, minLength: 1 },
    sourceRecord: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["attachmentId", "suppliedMediaType", "sourceRecord"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit clinical attachment media-type assertion and source without inspecting file contents. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attachmentId, suppliedMediaType, sourceRecord } = request;
  const compute = (): Output => {
    H.domain(attachmentId.length > 0, "attachmentId");
    H.domain(suppliedMediaType.length > 0, "suppliedMediaType");
    H.domain(sourceRecord.length > 0, "sourceRecord");
    return {
      token: JSON.stringify([attachmentId, suppliedMediaType, sourceRecord]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    attachmentId: "A17",
    suppliedMediaType: "application/pdf",
    sourceRecord: "R4",
  },
  output: { token: '["A17","application/pdf","R4"]' },
} satisfies ToolExample<Input, Output>;
export const clinicalAttachmentMediaTypeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/clinical-attachment-media-type-label",
    title: "Clinical Attachment Media Type Label Tool",
    description:
      "Preserve an explicit clinical attachment media-type assertion and source without inspecting file contents.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attachmentId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedMediaType: { type: "string", maxLength: 8192, minLength: 1 },
        sourceRecord: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["attachmentId", "suppliedMediaType", "sourceRecord"],
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
          id: "attachmentId",
          label: "Attachment Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedMediaType",
          label: "Supplied Media Type",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceRecord",
          label: "Source Record",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = clinicalAttachmentMediaTypeLabelTool.execute;
export default clinicalAttachmentMediaTypeLabelTool;
