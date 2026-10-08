import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cueId: string;
  readonly suppliedSpeakerLabel: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cueId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSpeakerLabel: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["cueId", "suppliedSpeakerLabel", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit caption speaker label by source without identifying a speaker from audio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cueId, suppliedSpeakerLabel, source } = request;
  const compute = (): Output => {
    H.domain(cueId.length > 0, "cueId");
    H.domain(suppliedSpeakerLabel.length > 0, "suppliedSpeakerLabel");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([cueId, suppliedSpeakerLabel, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cueId: "CUE17",
    suppliedSpeakerLabel: "Speaker A",
    source: "Caption record",
  },
  output: { token: '["CUE17","Speaker A","Caption record"]' },
} satisfies ToolExample<Input, Output>;
export const captionSpeakerIdentificationTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["disability-studies", "disability studies", "social sciences"],
      keywords: ["disability studies", "social sciences"],
    },
    id: "disability-studies/caption-speaker-identification-token",
    title: "Caption Speaker Identification Token",
    description:
      "Qualify an explicit caption speaker label by source without identifying a speaker from audio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cueId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSpeakerLabel: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["cueId", "suppliedSpeakerLabel", "source"],
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
          id: "cueId",
          label: "Cue Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSpeakerLabel",
          label: "Supplied Speaker Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = captionSpeakerIdentificationTokenTool.execute;
export default captionSpeakerIdentificationTokenTool;
