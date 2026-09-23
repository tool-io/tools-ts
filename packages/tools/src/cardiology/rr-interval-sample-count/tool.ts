import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durationSeconds: number;
  readonly sampleRateHz: number;
  readonly includeEndpoint: boolean;
};
export type Output = {
  readonly completeIntervals: number;
  readonly samples: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durationSeconds: { type: "number", minimum: 0 },
    sampleRateHz: { type: "number", exclusiveMinimum: 0 },
    includeEndpoint: { type: "boolean" },
  },
  required: ["durationSeconds", "sampleRateHz", "includeEndpoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completeIntervals: { type: "integer" },
    samples: { type: "integer" },
  },
  required: ["completeIntervals", "samples"],
} as const;
/** Count uniform research samples in a supplied interval using explicit endpoint inclusion; no rhythm interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durationSeconds, sampleRateHz, includeEndpoint } = request;
  const compute = (): Output => {
    H.domain(durationSeconds >= 0);
    H.positive(sampleRateHz);
    return {
      completeIntervals: Math.floor(durationSeconds * sampleRateHz),
      samples:
        Math.floor(durationSeconds * sampleRateHz) + (includeEndpoint ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { durationSeconds: 0.8, sampleRateHz: 250, includeEndpoint: true },
  output: { completeIntervals: 200, samples: 201 },
} satisfies ToolExample<Input, Output>;
export const rrIntervalSampleCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/rr-interval-sample-count",
    title: "RR Interval Sample Count Tool",
    description:
      "Count uniform research samples in a supplied interval using explicit endpoint inclusion; no rhythm interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durationSeconds: { type: "number", minimum: 0 },
        sampleRateHz: { type: "number", exclusiveMinimum: 0 },
        includeEndpoint: { type: "boolean" },
      },
      required: ["durationSeconds", "sampleRateHz", "includeEndpoint"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completeIntervals: { type: "integer" },
        samples: { type: "integer" },
      },
      required: ["completeIntervals", "samples"],
    },
    ports: {
      inputs: [
        {
          id: "durationSeconds",
          label: "Duration Seconds",
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
          id: "includeEndpoint",
          label: "Include Endpoint",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "completeIntervals",
          label: "Complete Intervals",
          valueType: { type: "integer" },
        },
        { id: "samples", label: "Samples", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = rrIntervalSampleCountTool.execute;
export default rrIntervalSampleCountTool;
