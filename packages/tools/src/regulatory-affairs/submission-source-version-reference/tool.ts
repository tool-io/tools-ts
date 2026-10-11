import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly submissionId: string;
  readonly sourceDocumentId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    submissionId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceDocumentId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["submissionId", "sourceDocumentId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit submission source-document reference by version without retrieving the document. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { submissionId, sourceDocumentId, version } = request;
  const compute = (): Output => {
    H.domain(submissionId.length > 0, "submissionId");
    H.domain(sourceDocumentId.length > 0, "sourceDocumentId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([submissionId, sourceDocumentId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { submissionId: "SUB17", sourceDocumentId: "DOC2", version: "v2" },
  output: { token: '["SUB17","DOC2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const submissionSourceVersionReferenceTool = H.defineSchemaCalculation<
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
    id: "regulatory-affairs/submission-source-version-reference",
    title: "Submission Source Version Reference",
    description:
      "Qualify an explicit submission source-document reference by version without retrieving the document.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        submissionId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceDocumentId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["submissionId", "sourceDocumentId", "version"],
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
          id: "submissionId",
          label: "Submission Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceDocumentId",
          label: "Source Document Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = submissionSourceVersionReferenceTool.execute;
export default submissionSourceVersionReferenceTool;
