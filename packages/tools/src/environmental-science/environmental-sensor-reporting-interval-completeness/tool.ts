import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expectedIntervals: number;
  readonly reportedIntervals: number;
};
export type Output = {
  readonly reportedFraction: number;
  readonly missingIntervals: number;
  readonly extraIntervals: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedIntervals: { type: "integer", minimum: 1 },
    reportedIntervals: { type: "integer", minimum: 0 },
  },
  required: ["expectedIntervals", "reportedIntervals"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedFraction: { type: "number" },
    missingIntervals: { type: "integer" },
    extraIntervals: { type: "integer" },
  },
  required: ["reportedFraction", "missingIntervals", "extraIntervals"],
} as const;
/** Compare explicit expected and reported interval counts without deriving expected sampling schedules or validating sensor readings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expectedIntervals, reportedIntervals } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(expectedIntervals) &&
        expectedIntervals >= 1 &&
        expectedIntervals <= Number.MAX_SAFE_INTEGER,
      "expectedIntervals",
    ),
      expectedIntervals);
    (H.domain(
      Number.isSafeInteger(reportedIntervals) &&
        reportedIntervals >= 0 &&
        reportedIntervals <= Number.MAX_SAFE_INTEGER,
      "reportedIntervals",
    ),
      reportedIntervals);
    return {
      reportedFraction: reportedIntervals / expectedIntervals,
      missingIntervals: Math.max(0, expectedIntervals - reportedIntervals),
      extraIntervals: Math.max(0, reportedIntervals - expectedIntervals),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expectedIntervals: 24, reportedIntervals: 21 },
  output: { reportedFraction: 0.875, missingIntervals: 3, extraIntervals: 0 },
} satisfies ToolExample<Input, Output>;
export const environmentalSensorReportingIntervalCompletenessTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "environmental-science",
          "environmental science",
          "earth and environmental sciences",
        ],
        keywords: ["environmental science", "earth and environmental sciences"],
      },
      id: "environmental-science/environmental-sensor-reporting-interval-completeness",
      title: "Environmental Sensor Reporting Interval Completeness",
      description:
        "Compare explicit expected and reported interval counts without deriving expected sampling schedules or validating sensor readings.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedIntervals: { type: "integer", minimum: 1 },
          reportedIntervals: { type: "integer", minimum: 0 },
        },
        required: ["expectedIntervals", "reportedIntervals"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reportedFraction: { type: "number" },
          missingIntervals: { type: "integer" },
          extraIntervals: { type: "integer" },
        },
        required: ["reportedFraction", "missingIntervals", "extraIntervals"],
      },
      ports: {
        inputs: [
          {
            id: "expectedIntervals",
            label: "Expected Intervals",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reportedIntervals",
            label: "Reported Intervals",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "reportedFraction",
            label: "Reported Fraction",
            valueType: { type: "number" },
          },
          {
            id: "missingIntervals",
            label: "Missing Intervals",
            valueType: { type: "integer" },
          },
          {
            id: "extraIntervals",
            label: "Extra Intervals",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = environmentalSensorReportingIntervalCompletenessTool.execute;
export default environmentalSensorReportingIntervalCompletenessTool;
