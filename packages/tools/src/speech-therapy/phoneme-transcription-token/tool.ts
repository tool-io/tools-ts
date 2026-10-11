import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly transcription: string;
  readonly notationSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    transcription: { type: "string", maxLength: 8192, minLength: 1 },
    notationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "transcription", "notationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit phoneme transcription and notation source without recognizing or diagnosing speech. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, transcription, notationSource } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(transcription.length > 0, "transcription");
    H.domain(notationSource.length > 0, "notationSource");
    return { token: JSON.stringify([sampleId, transcription, notationSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    transcription: "/k/",
    notationSource: "Transcription convention A",
  },
  output: { token: '["S17","/k/","Transcription convention A"]' },
} satisfies ToolExample<Input, Output>;
export const phonemeTranscriptionTokenTool = H.defineSchemaCalculation<
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
    id: "speech-therapy/phoneme-transcription-token",
    title: "Phoneme Transcription Token",
    description:
      "Record an explicit phoneme transcription and notation source without recognizing or diagnosing speech.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        transcription: { type: "string", maxLength: 8192, minLength: 1 },
        notationSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "transcription", "notationSource"],
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "transcription",
          label: "Transcription",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "notationSource",
          label: "Notation Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = phonemeTranscriptionTokenTool.execute;
export default phonemeTranscriptionTokenTool;
