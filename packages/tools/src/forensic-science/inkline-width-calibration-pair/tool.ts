import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly linePixels: number;
  readonly referencePixels: number;
  readonly referenceWidth: number;
  readonly calibrationUncertainty: number;
};
export type Output = {
  readonly width: number;
  readonly propagatedCalibrationUncertainty: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linePixels: { type: "number", minimum: 0 },
    referencePixels: { type: "number", exclusiveMinimum: 0 },
    referenceWidth: { type: "number", exclusiveMinimum: 0 },
    calibrationUncertainty: { type: "number", minimum: 0 },
  },
  required: [
    "linePixels",
    "referencePixels",
    "referenceWidth",
    "calibrationUncertainty",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    propagatedCalibrationUncertainty: { type: "number" },
  },
  required: ["width", "propagatedCalibrationUncertainty"],
} as const;
/** Pixel-to-length width with only the supplied reference-width uncertainty propagated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    linePixels,
    referencePixels,
    referenceWidth,
    calibrationUncertainty,
  } = request;
  const compute = (): Output => {
    H.domain(linePixels >= 0 && calibrationUncertainty >= 0);
    H.positive(referencePixels);
    H.positive(referenceWidth);
    return {
      width: (linePixels * referenceWidth) / referencePixels,
      propagatedCalibrationUncertainty:
        (linePixels * calibrationUncertainty) / referencePixels,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    linePixels: 4,
    referencePixels: 100,
    referenceWidth: 10,
    calibrationUncertainty: 0.1,
  },
  output: { width: 0.4, propagatedCalibrationUncertainty: 0.004 },
} satisfies ToolExample<Input, Output>;
export const inklineWidthCalibrationPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/inkline-width-calibration-pair",
    title: "Inkline Width Calibration Pair Tool",
    description:
      "Pixel-to-length width with only the supplied reference-width uncertainty propagated.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linePixels: { type: "number", minimum: 0 },
        referencePixels: { type: "number", exclusiveMinimum: 0 },
        referenceWidth: { type: "number", exclusiveMinimum: 0 },
        calibrationUncertainty: { type: "number", minimum: 0 },
      },
      required: [
        "linePixels",
        "referencePixels",
        "referenceWidth",
        "calibrationUncertainty",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        propagatedCalibrationUncertainty: { type: "number" },
      },
      required: ["width", "propagatedCalibrationUncertainty"],
    },
    ports: {
      inputs: [
        {
          id: "linePixels",
          label: "Line Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePixels",
          label: "Reference Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceWidth",
          label: "Reference Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "calibrationUncertainty",
          label: "Calibration Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        {
          id: "propagatedCalibrationUncertainty",
          label: "Propagated Calibration Uncertainty",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inklineWidthCalibrationPairTool.execute;
export default inklineWidthCalibrationPairTool;
