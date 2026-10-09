import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly patternId: string;
  readonly suppliedTranscription: string;
  readonly suppliedMeter: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    patternId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTranscription: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedMeter: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["patternId", "suppliedTranscription", "suppliedMeter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit rhythmic transcription and meter text without inferring pulse structure or cultural meter equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { patternId, suppliedTranscription, suppliedMeter } = request;
  const compute = (): Output => {
    H.domain(patternId.length > 0, "patternId");
    H.domain(suppliedTranscription.length > 0, "suppliedTranscription");
    H.domain(suppliedMeter.length > 0, "suppliedMeter");
    return {
      token: JSON.stringify([patternId, suppliedTranscription, suppliedMeter]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    patternId: "P17",
    suppliedTranscription: "x..x..",
    suppliedMeter: "6/8",
  },
  output: { token: '["P17","x..x..","6/8"]' },
} satisfies ToolExample<Input, Output>;
export const rhythmicPatternTranscriptionMeterTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ethnomusicology/rhythmic-pattern-transcription-meter-token",
      title: "Rhythmic Pattern Transcription Meter Token Tool",
      description:
        "Record explicit rhythmic transcription and meter text without inferring pulse structure or cultural meter equivalence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          patternId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedTranscription: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          suppliedMeter: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["patternId", "suppliedTranscription", "suppliedMeter"],
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
            id: "patternId",
            label: "Pattern Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedTranscription",
            label: "Supplied Transcription",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedMeter",
            label: "Supplied Meter",
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
export const run = rhythmicPatternTranscriptionMeterTokenTool.execute;
export default rhythmicPatternTranscriptionMeterTokenTool;
