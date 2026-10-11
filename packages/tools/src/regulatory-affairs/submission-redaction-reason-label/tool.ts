import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentId: string;
  readonly fieldId: string;
  readonly reasonWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    fieldId: { type: "string", maxLength: 8192, minLength: 1 },
    reasonWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["documentId", "fieldId", "reasonWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit submission redaction reason without deciding disclosure requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentId, fieldId, reasonWording } = request;
  const compute = (): Output => {
    H.domain(documentId.length > 0, "documentId");
    H.domain(fieldId.length > 0, "fieldId");
    H.domain(reasonWording.length > 0, "reasonWording");
    return { token: JSON.stringify([documentId, fieldId, reasonWording]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    documentId: "DOC17",
    fieldId: "F2",
    reasonWording: "personal information",
  },
  output: { token: '["DOC17","F2","personal information"]' },
} satisfies ToolExample<Input, Output>;
export const submissionRedactionReasonLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "regulatory-affairs",
        "regulatory affairs",
        "research and quality management",
      ],
      keywords: ["regulatory affairs", "research and quality management"],
    },
    id: "regulatory-affairs/submission-redaction-reason-label",
    title: "Submission Redaction Reason Label",
    description:
      "Preserve an explicit submission redaction reason without deciding disclosure requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
        fieldId: { type: "string", maxLength: 8192, minLength: 1 },
        reasonWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["documentId", "fieldId", "reasonWording"],
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
          id: "documentId",
          label: "Document Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fieldId",
          label: "Field Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reasonWording",
          label: "Reason Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = submissionRedactionReasonLabelTool.execute;
export default submissionRedactionReasonLabelTool;
