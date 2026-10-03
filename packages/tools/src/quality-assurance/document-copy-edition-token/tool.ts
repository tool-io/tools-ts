import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentId: string;
  readonly edition: string;
  readonly copyId: string;
};
export type Output = { readonly identityKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentId: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
    copyId: { type: "string", maxLength: 8192 },
  },
  required: ["documentId", "edition", "copyId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identityKey: { type: "string", maxLength: 8192 } },
  required: ["identityKey"],
} as const;
/** Preserve explicit document/edition/copy identity without determining a controlled-copy status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentId, edition, copyId } = request;
  const compute = (): Output => {
    H.domain(documentId.length > 0 && edition.length > 0 && copyId.length > 0);
    return { identityKey: JSON.stringify([documentId, edition, copyId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { documentId: "SOP1", edition: "v2", copyId: "copy3" },
  output: { identityKey: '["SOP1","v2","copy3"]' },
} satisfies ToolExample<Input, Output>;
export const documentCopyEditionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/document-copy-edition-token",
    title: "Document Copy Edition Token Tool",
    description:
      "Preserve explicit document/edition/copy identity without determining a controlled-copy status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentId: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
        copyId: { type: "string", maxLength: 8192 },
      },
      required: ["documentId", "edition", "copyId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { identityKey: { type: "string", maxLength: 8192 } },
      required: ["identityKey"],
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
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "copyId",
          label: "Copy Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "identityKey",
          label: "Identity Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = documentCopyEditionTokenTool.execute;
export default documentCopyEditionTokenTool;
