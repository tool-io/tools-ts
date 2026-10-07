import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly purposeWording: string;
  readonly permissionRecorded: boolean;
};
export type Output = { readonly permissionToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    purposeWording: { type: "string", maxLength: 8192, minLength: 1 },
    permissionRecorded: { type: "boolean" },
  },
  required: ["recordId", "purposeWording", "permissionRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { permissionToken: { type: "string", maxLength: 8192 } },
  required: ["permissionToken"],
} as const;
/** Record an explicit purpose-specific audio permission flag without establishing consent validity or recording audio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, purposeWording, permissionRecorded } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0 && purposeWording.length > 0, "recordId");
    return {
      permissionToken: JSON.stringify([
        recordId,
        purposeWording,
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
    recordId: "R17",
    purposeWording: "analysis",
    permissionRecorded: true,
  },
  output: { permissionToken: '["R17","analysis",true]' },
} satisfies ToolExample<Input, Output>;
export const consentAudioRecordingPermissionFieldTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["bioethics", "research and quality management"],
        keywords: ["bioethics", "research and quality management"],
      },
      id: "bioethics/consent-audio-recording-permission-field",
      title: "Consent Audio Recording Permission Field",
      description:
        "Record an explicit purpose-specific audio permission flag without establishing consent validity or recording audio.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          purposeWording: { type: "string", maxLength: 8192, minLength: 1 },
          permissionRecorded: { type: "boolean" },
        },
        required: ["recordId", "purposeWording", "permissionRecorded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { permissionToken: { type: "string", maxLength: 8192 } },
        required: ["permissionToken"],
      },
      ports: {
        inputs: [
          {
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "purposeWording",
            label: "Purpose Wording",
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
          {
            id: "permissionToken",
            label: "Permission Token",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = consentAudioRecordingPermissionFieldTool.execute;
export default consentAudioRecordingPermissionFieldTool;
