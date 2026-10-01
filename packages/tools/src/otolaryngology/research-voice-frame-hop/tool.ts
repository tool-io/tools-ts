import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hopSamples: number;
  readonly sampleRateHertz: number;
  readonly frameCount: number;
};
export type Output = {
  readonly hopSeconds: number;
  readonly startToStartSpanSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hopSamples: { type: "integer", minimum: 1 },
    sampleRateHertz: { type: "number", exclusiveMinimum: 0 },
    frameCount: { type: "integer", minimum: 0 },
  },
  required: ["hopSamples", "sampleRateHertz", "frameCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hopSeconds: { type: "number" },
    startToStartSpanSeconds: { type: "number" },
  },
  required: ["hopSeconds", "startToStartSpanSeconds"],
} as const;
/** Compute supplied research frame hop and first-to-last start span, excluding unspecified frame duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hopSamples, sampleRateHertz, frameCount } = request;
  const compute = (): Output => {
    H.integer(hopSamples, 1);
    H.positive(sampleRateHertz);
    H.integer(frameCount, 0);
    return {
      hopSeconds: hopSamples / sampleRateHertz,
      startToStartSpanSeconds:
        (Math.max(0, frameCount - 1) * hopSamples) / sampleRateHertz,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hopSamples: 160, sampleRateHertz: 16000, frameCount: 11 },
  output: { hopSeconds: 0.01, startToStartSpanSeconds: 0.1 },
} satisfies ToolExample<Input, Output>;
export const researchVoiceFrameHopTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "otolaryngology/research-voice-frame-hop",
    title: "Research Voice Frame Hop Tool",
    description:
      "Compute supplied research frame hop and first-to-last start span, excluding unspecified frame duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hopSamples: { type: "integer", minimum: 1 },
        sampleRateHertz: { type: "number", exclusiveMinimum: 0 },
        frameCount: { type: "integer", minimum: 0 },
      },
      required: ["hopSamples", "sampleRateHertz", "frameCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hopSeconds: { type: "number" },
        startToStartSpanSeconds: { type: "number" },
      },
      required: ["hopSeconds", "startToStartSpanSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "hopSamples",
          label: "Hop Samples",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleRateHertz",
          label: "Sample Rate Hertz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "frameCount",
          label: "Frame Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "hopSeconds",
          label: "Hop Seconds",
          valueType: { type: "number" },
        },
        {
          id: "startToStartSpanSeconds",
          label: "Start To Start Span Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchVoiceFrameHopTool.execute;
export default researchVoiceFrameHopTool;
