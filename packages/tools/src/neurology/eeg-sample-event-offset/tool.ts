import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventSample: number;
  readonly originSample: number;
  readonly sampleRateHertz: number;
  readonly sampleRounding: string;
};
export type Output = {
  readonly sampleOffset: number;
  readonly timeOffsetSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventSample: { type: "number" },
    originSample: { type: "integer" },
    sampleRateHertz: { type: "number", exclusiveMinimum: 0 },
    sampleRounding: {
      type: "string",
      maxLength: 8192,
      enum: ["exact", "floor", "ceil", "nearest-ties-positive"],
    },
  },
  required: [
    "eventSample",
    "originSample",
    "sampleRateHertz",
    "sampleRounding",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleOffset: { type: "number" },
    timeOffsetSeconds: { type: "number" },
  },
  required: ["sampleOffset", "timeOffsetSeconds"],
} as const;
/** Map one supplied EEG event sample relative to an explicit sample origin/rate and sample-rounding convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventSample, originSample, sampleRateHertz, sampleRounding } =
    request;
  const compute = (): Output => {
    H.positive(sampleRateHertz);
    H.domain(
      ["exact", "floor", "ceil", "nearest-ties-positive"].includes(
        sampleRounding,
      ),
    );
    const raw = eventSample - originSample,
      sampleOffset =
        sampleRounding === "exact"
          ? raw
          : sampleRounding === "floor"
            ? Math.floor(raw)
            : sampleRounding === "ceil"
              ? Math.ceil(raw)
              : Math.round(raw);
    return { sampleOffset, timeOffsetSeconds: sampleOffset / sampleRateHertz };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventSample: 120.4,
    originSample: 100,
    sampleRateHertz: 20,
    sampleRounding: "floor",
  },
  output: { sampleOffset: 20, timeOffsetSeconds: 1 },
} satisfies ToolExample<Input, Output>;
export const eegSampleEventOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/eeg-sample-event-offset",
    title: "EEG Sample Event Offset Tool",
    description:
      "Map one supplied EEG event sample relative to an explicit sample origin/rate and sample-rounding convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventSample: { type: "number" },
        originSample: { type: "integer" },
        sampleRateHertz: { type: "number", exclusiveMinimum: 0 },
        sampleRounding: {
          type: "string",
          maxLength: 8192,
          enum: ["exact", "floor", "ceil", "nearest-ties-positive"],
        },
      },
      required: [
        "eventSample",
        "originSample",
        "sampleRateHertz",
        "sampleRounding",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleOffset: { type: "number" },
        timeOffsetSeconds: { type: "number" },
      },
      required: ["sampleOffset", "timeOffsetSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "eventSample",
          label: "Event Sample",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originSample",
          label: "Origin Sample",
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
          id: "sampleRounding",
          label: "Sample Rounding",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sampleOffset",
          label: "Sample Offset",
          valueType: { type: "number" },
        },
        {
          id: "timeOffsetSeconds",
          label: "Time Offset Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eegSampleEventOffsetTool.execute;
export default eegSampleEventOffsetTool;
