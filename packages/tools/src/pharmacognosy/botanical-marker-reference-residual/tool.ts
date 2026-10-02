import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedMarker: number;
  readonly suppliedReference: number;
  readonly suppliedCalibrationFactor: number;
};
export type Output = {
  readonly calibratedMarker: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedMarker: { type: "number" },
    suppliedReference: { type: "number" },
    suppliedCalibrationFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "reportedMarker",
    "suppliedReference",
    "suppliedCalibrationFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calibratedMarker: { type: "number" },
    residual: { type: "number" },
  },
  required: ["calibratedMarker", "residual"],
} as const;
/** Compare supplied research assay measurements to an explicit marker reference without botanical identity or product efficacy inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedMarker, suppliedReference, suppliedCalibrationFactor } =
    request;
  const compute = (): Output => {
    H.positive(suppliedCalibrationFactor);
    return {
      calibratedMarker: reportedMarker * suppliedCalibrationFactor,
      residual: reportedMarker * suppliedCalibrationFactor - suppliedReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedMarker: 10,
    suppliedReference: 18,
    suppliedCalibrationFactor: 2,
  },
  output: { calibratedMarker: 20, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const botanicalMarkerReferenceResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/botanical-marker-reference-residual",
    title: "Botanical Marker Reference Residual Tool",
    description:
      "Compare supplied research assay measurements to an explicit marker reference without botanical identity or product efficacy inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedMarker: { type: "number" },
        suppliedReference: { type: "number" },
        suppliedCalibrationFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "reportedMarker",
        "suppliedReference",
        "suppliedCalibrationFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calibratedMarker: { type: "number" },
        residual: { type: "number" },
      },
      required: ["calibratedMarker", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "reportedMarker",
          label: "Reported Marker",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReference",
          label: "Supplied Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCalibrationFactor",
          label: "Supplied Calibration Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "calibratedMarker",
          label: "Calibrated Marker",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = botanicalMarkerReferenceResidualTool.execute;
export default botanicalMarkerReferenceResidualTool;
