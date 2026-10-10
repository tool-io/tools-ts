import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordingId: string;
  readonly publicationPurpose: string;
  readonly permissionRecorded: boolean;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordingId: { type: "string", maxLength: 8192, minLength: 1 },
    publicationPurpose: { type: "string", maxLength: 8192, minLength: 1 },
    permissionRecorded: { type: "boolean" },
  },
  required: ["recordingId", "publicationPurpose", "permissionRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit language-audio publication purpose and permission flag without establishing valid authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordingId, publicationPurpose, permissionRecorded } = request;
  const compute = (): Output => {
    H.domain(
      recordingId.length > 0 && publicationPurpose.length > 0,
      "recordingId",
    );
    return {
      token: JSON.stringify([
        recordingId,
        publicationPurpose,
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
    recordingId: "REC17",
    publicationPurpose: "public archive",
    permissionRecorded: true,
  },
  output: { token: '["REC17","public archive",true]' },
} satisfies ToolExample<Input, Output>;
export const languageAudioPublicationPermissionFieldTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["indigenous-studies", "indigenous studies", "humanities"],
        keywords: ["indigenous studies", "humanities"],
      },
      id: "indigenous-studies/language-audio-publication-permission-field",
      title: "Language Audio Publication Permission Field",
      description:
        "Record an explicit language-audio publication purpose and permission flag without establishing valid authorization.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordingId: { type: "string", maxLength: 8192, minLength: 1 },
          publicationPurpose: { type: "string", maxLength: 8192, minLength: 1 },
          permissionRecorded: { type: "boolean" },
        },
        required: ["recordingId", "publicationPurpose", "permissionRecorded"],
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
            id: "recordingId",
            label: "Recording Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "publicationPurpose",
            label: "Publication Purpose",
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
export const run = languageAudioPublicationPermissionFieldTool.execute;
export default languageAudioPublicationPermissionFieldTool;
