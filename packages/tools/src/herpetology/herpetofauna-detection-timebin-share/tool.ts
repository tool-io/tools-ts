import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly detections: number;
  readonly binMinutes: number;
  readonly totalObservationMinutes: number;
};
export type Output = {
  readonly timeShare: number;
  readonly detectionsPerMinute: number;
  readonly fullPeriodEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    detections: { type: "integer", minimum: 0 },
    binMinutes: { type: "number", exclusiveMinimum: 0 },
    totalObservationMinutes: { type: "number" },
  },
  required: ["detections", "binMinutes", "totalObservationMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timeShare: { type: "number" },
    detectionsPerMinute: { type: "number" },
    fullPeriodEquivalent: { type: "number" },
  },
  required: ["timeShare", "detectionsPerMinute", "fullPeriodEquivalent"],
} as const;
/** Time-bin encounter scaling under explicitly assumed constant effort and detection rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { detections, binMinutes, totalObservationMinutes } = request;
  const compute = (): Output => {
    H.integer(detections, 0);
    H.positive(binMinutes);
    H.domain(totalObservationMinutes >= binMinutes);
    return {
      timeShare: binMinutes / totalObservationMinutes,
      detectionsPerMinute: detections / binMinutes,
      fullPeriodEquivalent: (detections * totalObservationMinutes) / binMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { detections: 6, binMinutes: 10, totalObservationMinutes: 30 },
  output: {
    timeShare: 0.3333333333333333,
    detectionsPerMinute: 0.6,
    fullPeriodEquivalent: 18,
  },
} satisfies ToolExample<Input, Output>;
export const herpetofaunaDetectionTimebinShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/herpetofauna-detection-timebin-share",
    title: "Herpetofauna Detection Timebin Share Tool",
    description:
      "Time-bin encounter scaling under explicitly assumed constant effort and detection rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        detections: { type: "integer", minimum: 0 },
        binMinutes: { type: "number", exclusiveMinimum: 0 },
        totalObservationMinutes: { type: "number" },
      },
      required: ["detections", "binMinutes", "totalObservationMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timeShare: { type: "number" },
        detectionsPerMinute: { type: "number" },
        fullPeriodEquivalent: { type: "number" },
      },
      required: ["timeShare", "detectionsPerMinute", "fullPeriodEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "detections",
          label: "Detections",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "binMinutes",
          label: "Bin Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "totalObservationMinutes",
          label: "Total Observation Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
      ],
      outputs: [
        { id: "timeShare", label: "Time Share", valueType: { type: "number" } },
        {
          id: "detectionsPerMinute",
          label: "Detections Per Minute",
          valueType: { type: "number" },
        },
        {
          id: "fullPeriodEquivalent",
          label: "Full Period Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = herpetofaunaDetectionTimebinShareTool.execute;
export default herpetofaunaDetectionTimebinShareTool;
