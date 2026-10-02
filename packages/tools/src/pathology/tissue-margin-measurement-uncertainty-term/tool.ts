import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredDistance: number;
  readonly calibrationUncertainty: number;
  readonly endpointUncertainty: number;
  readonly coverageFactor: number;
};
export type Output = {
  readonly combinedStandard: number;
  readonly expandedUncertainty: number;
  readonly lower: number;
  readonly upper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredDistance: { type: "number" },
    calibrationUncertainty: { type: "number", minimum: 0 },
    endpointUncertainty: { type: "number", minimum: 0 },
    coverageFactor: { type: "number", minimum: 0 },
  },
  required: [
    "measuredDistance",
    "calibrationUncertainty",
    "endpointUncertainty",
    "coverageFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    combinedStandard: { type: "number" },
    expandedUncertainty: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["combinedStandard", "expandedUncertainty", "lower", "upper"],
} as const;
/** Independent standard-uncertainty quadrature and supplied coverage factor, without a margin-status or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    measuredDistance,
    calibrationUncertainty,
    endpointUncertainty,
    coverageFactor,
  } = request;
  const compute = (): Output => {
    H.domain(
      calibrationUncertainty >= 0 &&
        endpointUncertainty >= 0 &&
        coverageFactor >= 0,
    );
    return {
      combinedStandard: Math.hypot(calibrationUncertainty, endpointUncertainty),
      expandedUncertainty:
        coverageFactor *
        Math.hypot(calibrationUncertainty, endpointUncertainty),
      lower:
        measuredDistance -
        coverageFactor *
          Math.hypot(calibrationUncertainty, endpointUncertainty),
      upper:
        measuredDistance +
        coverageFactor *
          Math.hypot(calibrationUncertainty, endpointUncertainty),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredDistance: 5,
    calibrationUncertainty: 0.3,
    endpointUncertainty: 0.4,
    coverageFactor: 2,
  },
  output: { combinedStandard: 0.5, expandedUncertainty: 1, lower: 4, upper: 6 },
} satisfies ToolExample<Input, Output>;
export const tissueMarginMeasurementUncertaintyTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pathology/tissue-margin-measurement-uncertainty-term",
      title: "Tissue Margin Measurement Uncertainty Term Tool",
      description:
        "Independent standard-uncertainty quadrature and supplied coverage factor, without a margin-status or clinical interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measuredDistance: { type: "number" },
          calibrationUncertainty: { type: "number", minimum: 0 },
          endpointUncertainty: { type: "number", minimum: 0 },
          coverageFactor: { type: "number", minimum: 0 },
        },
        required: [
          "measuredDistance",
          "calibrationUncertainty",
          "endpointUncertainty",
          "coverageFactor",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          combinedStandard: { type: "number" },
          expandedUncertainty: { type: "number" },
          lower: { type: "number" },
          upper: { type: "number" },
        },
        required: ["combinedStandard", "expandedUncertainty", "lower", "upper"],
      },
      ports: {
        inputs: [
          {
            id: "measuredDistance",
            label: "Measured Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "calibrationUncertainty",
            label: "Calibration Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "endpointUncertainty",
            label: "Endpoint Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "coverageFactor",
            label: "Coverage Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "combinedStandard",
            label: "Combined Standard",
            valueType: { type: "number" },
          },
          {
            id: "expandedUncertainty",
            label: "Expanded Uncertainty",
            valueType: { type: "number" },
          },
          { id: "lower", label: "Lower", valueType: { type: "number" } },
          { id: "upper", label: "Upper", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = tissueMarginMeasurementUncertaintyTermTool.execute;
export default tissueMarginMeasurementUncertaintyTermTool;
