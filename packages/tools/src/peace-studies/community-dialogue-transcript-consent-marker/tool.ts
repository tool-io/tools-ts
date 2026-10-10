import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transcriptId: string;
  readonly permittedPurpose: string;
  readonly permissionRecorded: boolean;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transcriptId: { type: "string", maxLength: 8192, minLength: 1 },
    permittedPurpose: { type: "string", maxLength: 8192, minLength: 1 },
    permissionRecorded: { type: "boolean" },
  },
  required: ["transcriptId", "permittedPurpose", "permissionRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit community-dialogue transcript purpose-permission metadata without establishing consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transcriptId, permittedPurpose, permissionRecorded } = request;
  const compute = (): Output => {
    H.domain(
      transcriptId.length > 0 && permittedPurpose.length > 0,
      "transcriptId",
    );
    return {
      token: JSON.stringify([
        transcriptId,
        permittedPurpose,
        permissionRecorded,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    transcriptId: "TR17",
    permittedPurpose: "analysis",
    permissionRecorded: true,
  },
  output: { token: '["TR17","analysis",true]' },
} satisfies ToolExample<Input, Output>;
export const communityDialogueTranscriptConsentMarkerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["peace-studies", "peace studies", "social sciences"],
        keywords: ["peace studies", "social sciences"],
      },
      id: "peace-studies/community-dialogue-transcript-consent-marker",
      title: "Community Dialogue Transcript Consent Marker",
      description:
        "Record explicit community-dialogue transcript purpose-permission metadata without establishing consent validity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          transcriptId: { type: "string", maxLength: 8192, minLength: 1 },
          permittedPurpose: { type: "string", maxLength: 8192, minLength: 1 },
          permissionRecorded: { type: "boolean" },
        },
        required: ["transcriptId", "permittedPurpose", "permissionRecorded"],
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
            id: "transcriptId",
            label: "Transcript Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "permittedPurpose",
            label: "Permitted Purpose",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "permissionRecorded",
            label: "Permission Recorded",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = communityDialogueTranscriptConsentMarkerTool.execute;
export default communityDialogueTranscriptConsentMarkerTool;
