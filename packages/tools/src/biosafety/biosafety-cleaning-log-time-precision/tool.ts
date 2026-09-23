import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedMinute: number;
  readonly resolution: number;
  readonly rounded: boolean;
};
export type Output = {
  readonly earliest: number;
  readonly latestExclusive: number;
  readonly intervalWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedMinute: { type: "number" },
    resolution: { type: "number", exclusiveMinimum: 0 },
    rounded: { type: "boolean" },
  },
  required: ["recordedMinute", "resolution", "rounded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliest: { type: "number" },
    latestExclusive: { type: "number" },
    intervalWidth: { type: "number" },
  },
  required: ["earliest", "latestExclusive", "intervalWidth"],
} as const;
/** Represent supplied log timestamp rounding or truncation precision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedMinute, resolution, rounded } = request;
  const compute = (): Output => {
    H.positive(resolution);
    return {
      earliest: rounded ? recordedMinute - resolution / 2 : recordedMinute,
      latestExclusive: rounded
        ? recordedMinute + resolution / 2
        : recordedMinute + resolution,
      intervalWidth: resolution,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedMinute: 600, resolution: 10, rounded: true },
  output: { earliest: 595, latestExclusive: 605, intervalWidth: 10 },
} satisfies ToolExample<Input, Output>;
export const biosafetyCleaningLogTimePrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/biosafety-cleaning-log-time-precision",
    title: "Biosafety Cleaning Log Time Precision Tool",
    description:
      "Represent supplied log timestamp rounding or truncation precision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedMinute: { type: "number" },
        resolution: { type: "number", exclusiveMinimum: 0 },
        rounded: { type: "boolean" },
      },
      required: ["recordedMinute", "resolution", "rounded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliest: { type: "number" },
        latestExclusive: { type: "number" },
        intervalWidth: { type: "number" },
      },
      required: ["earliest", "latestExclusive", "intervalWidth"],
    },
    ports: {
      inputs: [
        {
          id: "recordedMinute",
          label: "Recorded Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resolution",
          label: "Resolution",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rounded",
          label: "Rounded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "earliest", label: "Earliest", valueType: { type: "number" } },
        {
          id: "latestExclusive",
          label: "Latest Exclusive",
          valueType: { type: "number" },
        },
        {
          id: "intervalWidth",
          label: "Interval Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biosafetyCleaningLogTimePrecisionTool.execute;
export default biosafetyCleaningLogTimePrecisionTool;
