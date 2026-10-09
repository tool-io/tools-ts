import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstChannelOnsetSamples: number;
  readonly secondChannelOnsetSamples: number;
  readonly sampleRateHz: number;
};
export type Output = {
  readonly offsetSamples: number;
  readonly offsetSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstChannelOnsetSamples: { type: "integer", minimum: 0 },
    secondChannelOnsetSamples: { type: "integer", minimum: 0 },
    sampleRateHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstChannelOnsetSamples",
    "secondChannelOnsetSamples",
    "sampleRateHz",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offsetSamples: { type: "integer" },
    offsetSeconds: { type: "number" },
  },
  required: ["offsetSamples", "offsetSeconds"],
} as const;
/** Compare explicitly marked channel onsets in samples and seconds at a supplied common sample rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstChannelOnsetSamples, secondChannelOnsetSamples, sampleRateHz } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(firstChannelOnsetSamples) &&
        firstChannelOnsetSamples >= 0 &&
        firstChannelOnsetSamples <= Number.MAX_SAFE_INTEGER,
      "firstChannelOnsetSamples",
    ),
      firstChannelOnsetSamples);
    (H.domain(
      Number.isSafeInteger(secondChannelOnsetSamples) &&
        secondChannelOnsetSamples >= 0 &&
        secondChannelOnsetSamples <= Number.MAX_SAFE_INTEGER,
      "secondChannelOnsetSamples",
    ),
      secondChannelOnsetSamples);
    (H.domain(sampleRateHz > 0, "sampleRateHz"), sampleRateHz);
    return {
      offsetSamples: secondChannelOnsetSamples - firstChannelOnsetSamples,
      offsetSeconds:
        (secondChannelOnsetSamples - firstChannelOnsetSamples) / sampleRateHz,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstChannelOnsetSamples: 1000,
    secondChannelOnsetSamples: 1240,
    sampleRateHz: 48000,
  },
  output: { offsetSamples: 240, offsetSeconds: 0.005 },
} satisfies ToolExample<Input, Output>;
export const recordingChannelOnsetOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["ethnomusicology", "arts and design"],
      keywords: ["ethnomusicology", "arts and design"],
    },
    id: "ethnomusicology/recording-channel-onset-offset",
    title: "Recording Channel Onset Offset",
    description:
      "Compare explicitly marked channel onsets in samples and seconds at a supplied common sample rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstChannelOnsetSamples: { type: "integer", minimum: 0 },
        secondChannelOnsetSamples: { type: "integer", minimum: 0 },
        sampleRateHz: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstChannelOnsetSamples",
        "secondChannelOnsetSamples",
        "sampleRateHz",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offsetSamples: { type: "integer" },
        offsetSeconds: { type: "number" },
      },
      required: ["offsetSamples", "offsetSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "firstChannelOnsetSamples",
          label: "First Channel Onset Samples",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondChannelOnsetSamples",
          label: "Second Channel Onset Samples",
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
          id: "offsetSamples",
          label: "Offset Samples",
          valueType: { type: "integer" },
        },
        {
          id: "offsetSeconds",
          label: "Offset Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recordingChannelOnsetOffsetTool.execute;
export default recordingChannelOnsetOffsetTool;
