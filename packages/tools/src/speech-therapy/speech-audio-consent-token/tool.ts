import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordingId: string;
  readonly purposeCode: string;
  readonly permissionRecorded: boolean;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordingId: { type: "string", maxLength: 8192, minLength: 1 },
    purposeCode: { type: "string", maxLength: 8192, minLength: 1 },
    permissionRecorded: { type: "boolean" },
  },
  required: ["recordingId", "purposeCode", "permissionRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit speech-audio purpose and permission flag without determining consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordingId, purposeCode, permissionRecorded } = request;
  const compute = (): Output => {
    H.domain(recordingId.length > 0 && purposeCode.length > 0, "recordingId");
    return {
      token: JSON.stringify([recordingId, purposeCode, permissionRecorded]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordingId: "REC17",
    purposeCode: "teaching",
    permissionRecorded: true,
  },
  output: { token: '["REC17","teaching",true]' },
} satisfies ToolExample<Input, Output>;
export const speechAudioConsentTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["speech-therapy", "speech therapy", "health and medicine"],
      keywords: ["speech therapy", "health and medicine"],
    },
    id: "speech-therapy/speech-audio-consent-token",
    title: "Speech Audio Consent Token",
    description:
      "Record an explicit speech-audio purpose and permission flag without determining consent validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordingId: { type: "string", maxLength: 8192, minLength: 1 },
        purposeCode: { type: "string", maxLength: 8192, minLength: 1 },
        permissionRecorded: { type: "boolean" },
      },
      required: ["recordingId", "purposeCode", "permissionRecorded"],
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
          id: "purposeCode",
          label: "Purpose Code",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = speechAudioConsentTokenTool.execute;
export default speechAudioConsentTokenTool;
