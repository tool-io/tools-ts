import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordingId: string;
  readonly distanceText: string;
  readonly referencePoint: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordingId: { type: "string", maxLength: 8192, minLength: 1 },
    distanceText: { type: "string", maxLength: 8192, minLength: 1 },
    referencePoint: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordingId", "distanceText", "referencePoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit field-recording microphone distance transcription and reference point without recording recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordingId, distanceText, referencePoint } = request;
  const compute = (): Output => {
    H.domain(recordingId.length > 0, "recordingId");
    H.domain(distanceText.length > 0, "distanceText");
    H.domain(referencePoint.length > 0, "referencePoint");
    return {
      token: JSON.stringify([recordingId, distanceText, referencePoint]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordingId: "R17",
    distanceText: "2 m",
    referencePoint: "performer position",
  },
  output: { token: '["R17","2 m","performer position"]' },
} satisfies ToolExample<Input, Output>;
export const fieldRecordingMicrophoneDistanceNoteTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ethnomusicology/field-recording-microphone-distance-note",
      title: "Field Recording Microphone Distance Note Tool",
      description:
        "Preserve an explicit field-recording microphone distance transcription and reference point without recording recommendations.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordingId: { type: "string", maxLength: 8192, minLength: 1 },
          distanceText: { type: "string", maxLength: 8192, minLength: 1 },
          referencePoint: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordingId", "distanceText", "referencePoint"],
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
            id: "distanceText",
            label: "Distance Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "referencePoint",
            label: "Reference Point",
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
export const run = fieldRecordingMicrophoneDistanceNoteTool.execute;
export default fieldRecordingMicrophoneDistanceNoteTool;
