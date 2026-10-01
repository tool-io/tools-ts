import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hopSamples: number;
  readonly sampleRateHz: number;
};
export type Output = { readonly hopSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hopSamples: { type: "integer", minimum: 0 },
    sampleRateHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["hopSamples", "sampleRateHz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { hopSeconds: { type: "number" } },
  required: ["hopSeconds"],
} as const;
/** Calculate voice sample hop duration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hopSamples, sampleRateHz } = request;
  const compute = (): Output => {
    H.integer(hopSamples, 0);
    H.positive(sampleRateHz);
    return { hopSeconds: hopSamples / sampleRateHz };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hopSamples: 160, sampleRateHz: 16000 },
  output: { hopSeconds: 0.01 },
} satisfies ToolExample<Input, Output>;
export const voiceSampleHopDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "otolaryngology/voice-sample-hop-duration",
    title: "Voice Sample Hop Duration Tool",
    description:
      "Calculate voice sample hop duration from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hopSamples: { type: "integer", minimum: 0 },
        sampleRateHz: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["hopSamples", "sampleRateHz"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { hopSeconds: { type: "number" } },
      required: ["hopSeconds"],
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
          id: "sampleRateHz",
          label: "Sample Rate Hz",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "hopSeconds",
          label: "Hop Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = voiceSampleHopDurationTool.execute;
export default voiceSampleHopDurationTool;
