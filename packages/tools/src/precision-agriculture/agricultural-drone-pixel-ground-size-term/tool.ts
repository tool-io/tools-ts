import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly height: number;
  readonly sensorPixelPitch: number;
  readonly focalLength: number;
  readonly obliqueScale: number;
};
export type Output = { readonly groundPixelSize: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    height: { type: "number", minimum: 0 },
    sensorPixelPitch: { type: "number", exclusiveMinimum: 0 },
    focalLength: { type: "number", exclusiveMinimum: 0 },
    obliqueScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["height", "sensorPixelPitch", "focalLength", "obliqueScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { groundPixelSize: { type: "number" } },
  required: ["groundPixelSize"],
} as const;
/** Supplied pinhole pixel scale with an explicit obliquity factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { height, sensorPixelPitch, focalLength, obliqueScale } = request;
  const compute = (): Output => {
    H.domain(height >= 0);
    H.positive(sensorPixelPitch);
    H.positive(focalLength);
    H.positive(obliqueScale);
    return {
      groundPixelSize: (height * sensorPixelPitch * obliqueScale) / focalLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    height: 100,
    sensorPixelPitch: 0.000005,
    focalLength: 0.05,
    obliqueScale: 1,
  },
  output: { groundPixelSize: 0.01 },
} satisfies ToolExample<Input, Output>;
export const agriculturalDronePixelGroundSizeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "precision-agriculture/agricultural-drone-pixel-ground-size-term",
      title: "Agricultural Drone Pixel Ground Size Term Tool",
      description:
        "Supplied pinhole pixel scale with an explicit obliquity factor.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          height: { type: "number", minimum: 0 },
          sensorPixelPitch: { type: "number", exclusiveMinimum: 0 },
          focalLength: { type: "number", exclusiveMinimum: 0 },
          obliqueScale: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["height", "sensorPixelPitch", "focalLength", "obliqueScale"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { groundPixelSize: { type: "number" } },
        required: ["groundPixelSize"],
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
            id: "sensorPixelPitch",
            label: "Sensor Pixel Pitch",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "focalLength",
            label: "Focal Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "obliqueScale",
            label: "Oblique Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "groundPixelSize",
            label: "Ground Pixel Size",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = agriculturalDronePixelGroundSizeTermTool.execute;
export default agriculturalDronePixelGroundSizeTermTool;
