import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly height: number;
  readonly reportingQuantum: number;
};
export type Output = {
  readonly reportedHeight: number;
  readonly signedAdjustment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    height: { type: "number", minimum: 0 },
    reportingQuantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["height", "reportingQuantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedHeight: { type: "number" },
    signedAdjustment: { type: "number" },
  },
  required: ["reportedHeight", "signedAdjustment"],
} as const;
/** Round supplied height to the nearest explicit reporting quantum with ties upward without interpreting growth. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { height, reportingQuantum } = request;
  const compute = (): Output => {
    H.domain(height >= 0, "height");
    (H.domain(
      Number.isFinite(reportingQuantum) && reportingQuantum > 0,
      "reportingQuantum",
    ),
      reportingQuantum);
    return (() => {
      const reportedHeight =
        Math.round(height / reportingQuantum) * reportingQuantum;
      return { reportedHeight, signedAdjustment: reportedHeight - height };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { height: 102.4, reportingQuantum: 0.5 },
  output: { reportedHeight: 102.5, signedAdjustment: 0.09999999999999432 },
} satisfies ToolExample<Input, Output>;
export const childHeightRecordMeasurementRoundingTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["child-development", "child development", "psychology"],
        keywords: ["child development", "psychology"],
      },
      id: "child-development/child-height-record-measurement-rounding",
      title: "Child Height Record Measurement Rounding",
      description:
        "Round supplied height to the nearest explicit reporting quantum with ties upward without interpreting growth.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          height: { type: "number", minimum: 0 },
          reportingQuantum: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["height", "reportingQuantum"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reportedHeight: { type: "number" },
          signedAdjustment: { type: "number" },
        },
        required: ["reportedHeight", "signedAdjustment"],
      },
      ports: {
        inputs: [
          {
            id: "height",
            label: "Height",
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
            id: "reportedHeight",
            label: "Reported Height",
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
export const run = childHeightRecordMeasurementRoundingTool.execute;
export default childHeightRecordMeasurementRoundingTool;
