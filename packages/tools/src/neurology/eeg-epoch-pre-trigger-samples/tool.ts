import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pretriggerMilliseconds: number;
  readonly sampleRateHz: number;
  readonly rounding: string;
};
export type Output = {
  readonly rawSamples: number;
  readonly samples: number;
  readonly durationMilliseconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pretriggerMilliseconds: { type: "number", minimum: 0 },
    sampleRateHz: { type: "number", exclusiveMinimum: 0 },
    rounding: {
      type: "string",
      maxLength: 8192,
      enum: ["floor", "ceil", "nearest"],
    },
  },
  required: ["pretriggerMilliseconds", "sampleRateHz", "rounding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawSamples: { type: "number" },
    samples: { type: "integer" },
    durationMilliseconds: { type: "number" },
  },
  required: ["rawSamples", "samples", "durationMilliseconds"],
} as const;
/** Convert a supplied EEG pretrigger duration to a sample count under an explicit rounding convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pretriggerMilliseconds, sampleRateHz, rounding } = request;
  const compute = (): Output => {
    H.domain(pretriggerMilliseconds >= 0, "pretriggerMilliseconds");
    (H.domain(sampleRateHz > 0, "sampleRateHz"), sampleRateHz);
    H.domain(["floor", "ceil", "nearest"].includes(rounding), "rounding");
    return (() => {
      const rawSamples = (pretriggerMilliseconds * sampleRateHz) / 1000,
        samples =
          rounding === "floor"
            ? Math.floor(rawSamples)
            : rounding === "ceil"
              ? Math.ceil(rawSamples)
              : Math.round(rawSamples);
      return {
        rawSamples,
        samples,
        durationMilliseconds: (1000 * samples) / sampleRateHz,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pretriggerMilliseconds: 125,
    sampleRateHz: 100,
    rounding: "nearest",
  },
  output: { rawSamples: 12.5, samples: 13, durationMilliseconds: 130 },
} satisfies ToolExample<Input, Output>;
export const eegEpochPreTriggerSamplesTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neurology", "health and medicine"],
      keywords: ["neurology", "health and medicine"],
    },
    id: "neurology/eeg-epoch-pre-trigger-samples",
    title: "EEG Epoch Pre Trigger Samples",
    description:
      "Convert a supplied EEG pretrigger duration to a sample count under an explicit rounding convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pretriggerMilliseconds: { type: "number", minimum: 0 },
        sampleRateHz: { type: "number", exclusiveMinimum: 0 },
        rounding: {
          type: "string",
          maxLength: 8192,
          enum: ["floor", "ceil", "nearest"],
        },
      },
      required: ["pretriggerMilliseconds", "sampleRateHz", "rounding"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawSamples: { type: "number" },
        samples: { type: "integer" },
        durationMilliseconds: { type: "number" },
      },
      required: ["rawSamples", "samples", "durationMilliseconds"],
    },
    ports: {
      inputs: [
        {
          id: "pretriggerMilliseconds",
          label: "Pretrigger Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleRateHz",
          label: "Sample Rate Hz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rounding",
          label: "Rounding",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "rawSamples",
          label: "Raw Samples",
          valueType: { type: "number" },
        },
        { id: "samples", label: "Samples", valueType: { type: "integer" } },
        {
          id: "durationMilliseconds",
          label: "Duration Milliseconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eegEpochPreTriggerSamplesTool.execute;
export default eegEpochPreTriggerSamplesTool;
