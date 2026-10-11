import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly submissionId: string;
  readonly sequenceText: string;
  readonly authorityNamespace: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    submissionId: { type: "string", maxLength: 8192, minLength: 1 },
    sequenceText: { type: "string", maxLength: 8192, minLength: 1 },
    authorityNamespace: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["submissionId", "sequenceText", "authorityNamespace"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit submission sequence string by authority namespace without validating a dossier. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { submissionId, sequenceText, authorityNamespace } = request;
  const compute = (): Output => {
    H.domain(submissionId.length > 0, "submissionId");
    H.domain(sequenceText.length > 0, "sequenceText");
    H.domain(authorityNamespace.length > 0, "authorityNamespace");
    return {
      token: JSON.stringify([submissionId, sequenceText, authorityNamespace]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    submissionId: "SUB17",
    sequenceText: "0002",
    authorityNamespace: "Authority A",
  },
  output: { token: '["SUB17","0002","Authority A"]' },
} satisfies ToolExample<Input, Output>;
export const regulatoryDocumentSequenceTokenTool = H.defineSchemaCalculation<
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
    id: "regulatory-affairs/regulatory-document-sequence-token",
    title: "Regulatory Document Sequence Token",
    description:
      "Qualify an explicit submission sequence string by authority namespace without validating a dossier.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        submissionId: { type: "string", maxLength: 8192, minLength: 1 },
        sequenceText: { type: "string", maxLength: 8192, minLength: 1 },
        authorityNamespace: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["submissionId", "sequenceText", "authorityNamespace"],
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
          id: "sequenceText",
          label: "Sequence Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authorityNamespace",
          label: "Authority Namespace",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = regulatoryDocumentSequenceTokenTool.execute;
export default regulatoryDocumentSequenceTokenTool;
