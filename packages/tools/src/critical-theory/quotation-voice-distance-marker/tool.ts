import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speaker: string;
  readonly quotedSpeaker: string;
  readonly suppliedDistance: string;
  readonly allowedDistances: readonly string[];
};
export type Output = {
  readonly sameVoice: boolean;
  readonly recognizedDistance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speaker: { type: "string", maxLength: 8192 },
    quotedSpeaker: { type: "string", maxLength: 8192 },
    suppliedDistance: { type: "string", maxLength: 8192 },
    allowedDistances: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "speaker",
    "quotedSpeaker",
    "suppliedDistance",
    "allowedDistances",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameVoice: { type: "boolean" },
    recognizedDistance: { type: "boolean" },
  },
  required: ["sameVoice", "recognizedDistance"],
} as const;
/** Retain supplied annotation distinctions without inferring authorial stance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speaker, quotedSpeaker, suppliedDistance, allowedDistances } =
    request;
  const compute = (): Output => {
    return {
      sameVoice: speaker === quotedSpeaker,
      recognizedDistance: allowedDistances.includes(suppliedDistance),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    speaker: "A",
    quotedSpeaker: "B",
    suppliedDistance: "reported",
    allowedDistances: ["direct", "reported"],
  },
  output: { sameVoice: false, recognizedDistance: true },
} satisfies ToolExample<Input, Output>;
export const quotationVoiceDistanceMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "critical-theory/quotation-voice-distance-marker",
    title: "Quotation Voice Distance Marker Tool",
    description:
      "Retain supplied annotation distinctions without inferring authorial stance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speaker: { type: "string", maxLength: 8192 },
        quotedSpeaker: { type: "string", maxLength: 8192 },
        suppliedDistance: { type: "string", maxLength: 8192 },
        allowedDistances: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "speaker",
        "quotedSpeaker",
        "suppliedDistance",
        "allowedDistances",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameVoice: { type: "boolean" },
        recognizedDistance: { type: "boolean" },
      },
      required: ["sameVoice", "recognizedDistance"],
    },
    ports: {
      inputs: [
        {
          id: "speaker",
          label: "Speaker",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "quotedSpeaker",
          label: "Quoted Speaker",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedDistance",
          label: "Supplied Distance",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedDistances",
          label: "Allowed Distances",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "sameVoice",
          label: "Same Voice",
          valueType: { type: "boolean" },
        },
        {
          id: "recognizedDistance",
          label: "Recognized Distance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = quotationVoiceDistanceMarkerTool.execute;
export default quotationVoiceDistanceMarkerTool;
