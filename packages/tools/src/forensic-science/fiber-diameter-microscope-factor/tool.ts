import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ocularDivisions: number;
  readonly calibratedMicrometersPerDivision: number;
  readonly obliquityRadians: number;
};
export type Output = {
  readonly projectedMicrometers: number;
  readonly correctedMicrometers: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ocularDivisions: { type: "number", minimum: 0 },
    calibratedMicrometersPerDivision: { type: "number", exclusiveMinimum: 0 },
    obliquityRadians: { type: "number" },
  },
  required: [
    "ocularDivisions",
    "calibratedMicrometersPerDivision",
    "obliquityRadians",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectedMicrometers: { type: "number" },
    correctedMicrometers: { type: "number" },
  },
  required: ["projectedMicrometers", "correctedMicrometers"],
} as const;
/** Explicit projection correction along the measured width axis, assuming a foreshortening factor cos(angle); no fiber type is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    ocularDivisions,
    calibratedMicrometersPerDivision,
    obliquityRadians,
  } = request;
  const compute = (): Output => {
    H.domain(
      ocularDivisions >= 0 &&
        obliquityRadians > -Math.PI / 2 &&
        obliquityRadians < Math.PI / 2,
    );
    H.positive(calibratedMicrometersPerDivision);
    return {
      projectedMicrometers: ocularDivisions * calibratedMicrometersPerDivision,
      correctedMicrometers:
        (ocularDivisions * calibratedMicrometersPerDivision) /
        Math.cos(obliquityRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ocularDivisions: 8,
    calibratedMicrometersPerDivision: 2.5,
    obliquityRadians: 0,
  },
  output: { projectedMicrometers: 20, correctedMicrometers: 20 },
} satisfies ToolExample<Input, Output>;
export const fiberDiameterMicroscopeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/fiber-diameter-microscope-factor",
    title: "Fiber Diameter Microscope Factor Tool",
    description:
      "Explicit projection correction along the measured width axis, assuming a foreshortening factor cos(angle); no fiber type is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ocularDivisions: { type: "number", minimum: 0 },
        calibratedMicrometersPerDivision: {
          type: "number",
          exclusiveMinimum: 0,
        },
        obliquityRadians: { type: "number" },
      },
      required: [
        "ocularDivisions",
        "calibratedMicrometersPerDivision",
        "obliquityRadians",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        projectedMicrometers: { type: "number" },
        correctedMicrometers: { type: "number" },
      },
      required: ["projectedMicrometers", "correctedMicrometers"],
    },
    ports: {
      inputs: [
        {
          id: "ocularDivisions",
          label: "Ocular Divisions",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "calibratedMicrometersPerDivision",
          label: "Calibrated Micrometers Per Division",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "obliquityRadians",
          label: "Obliquity Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        {
          id: "projectedMicrometers",
          label: "Projected Micrometers",
          valueType: { type: "number" },
        },
        {
          id: "correctedMicrometers",
          label: "Corrected Micrometers",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fiberDiameterMicroscopeFactorTool.execute;
export default fiberDiameterMicroscopeFactorTool;
