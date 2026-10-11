import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly intervalMilliseconds: number };
export type Output = { readonly sampleRateHz: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { intervalMilliseconds: { type: "number", exclusiveMinimum: 0 } },
  required: ["intervalMilliseconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sampleRateHz: { type: "number" } },
  required: ["sampleRateHz"],
} as const;
/** Convert an explicit constant physiological sampling interval in milliseconds to samples per second. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intervalMilliseconds } = request;
  const compute = (): Output => {
    (H.domain(intervalMilliseconds > 0, "intervalMilliseconds"),
      intervalMilliseconds);
    return { sampleRateHz: 1000 / intervalMilliseconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intervalMilliseconds: 2 },
  output: { sampleRateHz: 500 },
} satisfies ToolExample<Input, Output>;
export const physiologicalSamplingIntervalRateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["physiology", "biology"],
      keywords: ["physiology", "biology"],
    },
    id: "physiology/physiological-sampling-interval-rate",
    title: "Physiological Sampling Interval Rate",
    description:
      "Convert an explicit constant physiological sampling interval in milliseconds to samples per second.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intervalMilliseconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["intervalMilliseconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sampleRateHz: { type: "number" } },
      required: ["sampleRateHz"],
    },
    ports: {
      inputs: [
        {
          id: "intervalMilliseconds",
          label: "Interval Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sampleRateHz",
          label: "Sample Rate Hz",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = physiologicalSamplingIntervalRateTool.execute;
export default physiologicalSamplingIntervalRateTool;
