import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reading: number;
  readonly reportingQuantum: number;
};
export type Output = {
  readonly reportedReading: number;
  readonly signedAdjustment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reading: { type: "number", minimum: 0 },
    reportingQuantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reading", "reportingQuantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedReading: { type: "number" },
    signedAdjustment: { type: "number" },
  },
  required: ["reportedReading", "signedAdjustment"],
} as const;
/** Round an explicit nonnegative probe reading to a supplied reporting quantum with ties upward without interpreting periodontal health. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reading, reportingQuantum } = request;
  const compute = (): Output => {
    H.domain(reading >= 0, "reading");
    (H.domain(
      Number.isFinite(reportingQuantum) && reportingQuantum > 0,
      "reportingQuantum",
    ),
      reportingQuantum);
    return (() => {
      const reportedReading =
        Math.round(reading / reportingQuantum) * reportingQuantum;
      return { reportedReading, signedAdjustment: reportedReading - reading };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reading: 3.4, reportingQuantum: 0.5 },
  output: { reportedReading: 3.5, signedAdjustment: 0.10000000000000009 },
} satisfies ToolExample<Input, Output>;
export const periodontalProbeReadingRoundingLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "dental-hygiene/periodontal-probe-reading-rounding-label",
      title: "Periodontal Probe Reading Rounding Label Tool",
      description:
        "Round an explicit nonnegative probe reading to a supplied reporting quantum with ties upward without interpreting periodontal health.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reading: { type: "number", minimum: 0 },
          reportingQuantum: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["reading", "reportingQuantum"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reportedReading: { type: "number" },
          signedAdjustment: { type: "number" },
        },
        required: ["reportedReading", "signedAdjustment"],
      },
      ports: {
        inputs: [
          {
            id: "reading",
            label: "Reading",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reportingQuantum",
            label: "Reporting Quantum",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "reportedReading",
            label: "Reported Reading",
            valueType: { type: "number" },
          },
          {
            id: "signedAdjustment",
            label: "Signed Adjustment",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = periodontalProbeReadingRoundingLabelTool.execute;
export default periodontalProbeReadingRoundingLabelTool;
