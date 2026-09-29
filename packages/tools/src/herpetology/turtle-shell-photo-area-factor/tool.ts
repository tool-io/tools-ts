import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixelArea: number;
  readonly scaleLength: number;
  readonly scalePixels: number;
  readonly obliquityRadians: number;
};
export type Output = {
  readonly projectedArea: number;
  readonly correctedArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixelArea: { type: "number", minimum: 0 },
    scaleLength: { type: "number", exclusiveMinimum: 0 },
    scalePixels: { type: "number", exclusiveMinimum: 0 },
    obliquityRadians: { type: "number" },
  },
  required: ["pixelArea", "scaleLength", "scalePixels", "obliquityRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectedArea: { type: "number" },
    correctedArea: { type: "number" },
  },
  required: ["projectedArea", "correctedArea"],
} as const;
/** Planar photo-area calibration with a supplied single-axis cosine foreshortening correction, excluding shell curvature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixelArea, scaleLength, scalePixels, obliquityRadians } = request;
  const compute = (): Output => {
    H.domain(pixelArea >= 0);
    H.positive(scaleLength);
    H.positive(scalePixels);
    H.domain(obliquityRadians > -Math.PI / 2 && obliquityRadians < Math.PI / 2);
    return {
      projectedArea: pixelArea * (scaleLength / scalePixels) ** 2,
      correctedArea:
        (pixelArea * (scaleLength / scalePixels) ** 2) /
        Math.cos(obliquityRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pixelArea: 10000,
    scaleLength: 10,
    scalePixels: 100,
    obliquityRadians: 0,
  },
  output: {
    projectedArea: 100.00000000000001,
    correctedArea: 100.00000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const turtleShellPhotoAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/turtle-shell-photo-area-factor",
    title: "Turtle Shell Photo Area Factor Tool",
    description:
      "Planar photo-area calibration with a supplied single-axis cosine foreshortening correction, excluding shell curvature.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixelArea: { type: "number", minimum: 0 },
        scaleLength: { type: "number", exclusiveMinimum: 0 },
        scalePixels: { type: "number", exclusiveMinimum: 0 },
        obliquityRadians: { type: "number" },
      },
      required: ["pixelArea", "scaleLength", "scalePixels", "obliquityRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        projectedArea: { type: "number" },
        correctedArea: { type: "number" },
      },
      required: ["projectedArea", "correctedArea"],
    },
    ports: {
      inputs: [
        {
          id: "pixelArea",
          label: "Pixel Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleLength",
          label: "Scale Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scalePixels",
          label: "Scale Pixels",
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
          id: "projectedArea",
          label: "Projected Area",
          valueType: { type: "number" },
        },
        {
          id: "correctedArea",
          label: "Corrected Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = turtleShellPhotoAreaFactorTool.execute;
export default turtleShellPhotoAreaFactorTool;
