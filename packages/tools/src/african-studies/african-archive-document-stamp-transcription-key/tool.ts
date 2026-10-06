import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly archiveId: string;
  readonly documentId: string;
  readonly suppliedStampTranscription: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    archiveId: { type: "string", maxLength: 8192, minLength: 1 },
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedStampTranscription: {
      type: "string",
      maxLength: 8192,
      minLength: 1,
    },
  },
  required: ["archiveId", "documentId", "suppliedStampTranscription"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly supplied archival stamp transcription by document without deciphering or authenticating the stamp. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { archiveId, documentId, suppliedStampTranscription } = request;
  const compute = (): Output => {
    H.domain(archiveId.length > 0, "archiveId");
    H.domain(documentId.length > 0, "documentId");
    H.domain(
      suppliedStampTranscription.length > 0,
      "suppliedStampTranscription",
    );
    return {
      token: JSON.stringify([
        archiveId,
        documentId,
        suppliedStampTranscription,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    archiveId: "AR17",
    documentId: "DOC2",
    suppliedStampTranscription: "Stamp reading A",
  },
  output: { token: '["AR17","DOC2","Stamp reading A"]' },
} satisfies ToolExample<Input, Output>;
export const africanArchiveDocumentStampTranscriptionKeyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["african-studies", "african studies", "humanities"],
        keywords: ["african studies", "humanities"],
      },
      id: "african-studies/african-archive-document-stamp-transcription-key",
      title: "African Archive Document Stamp Transcription Key",
      description:
        "Qualify an explicitly supplied archival stamp transcription by document without deciphering or authenticating the stamp.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          archiveId: { type: "string", maxLength: 8192, minLength: 1 },
          documentId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedStampTranscription: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["archiveId", "documentId", "suppliedStampTranscription"],
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
            id: "archiveId",
            label: "Archive Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "documentId",
            label: "Document Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedStampTranscription",
            label: "Supplied Stamp Transcription",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = africanArchiveDocumentStampTranscriptionKeyTool.execute;
export default africanArchiveDocumentStampTranscriptionKeyTool;
