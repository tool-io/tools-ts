import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixels: number;
  readonly millimetersPerPixel: number;
  readonly viewingDistanceMm: number;
};
export type Output = {
  readonly millimeters: number;
  readonly approximateRadians: number;
  readonly exactRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixels: { type: "number", minimum: 0 },
    millimetersPerPixel: { type: "number", exclusiveMinimum: 0 },
    viewingDistanceMm: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pixels", "millimetersPerPixel", "viewingDistanceMm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    millimeters: { type: "number" },
    approximateRadians: { type: "number" },
    exactRadians: { type: "number" },
  },
  required: ["millimeters", "approximateRadians", "exactRadians"],
} as const;
/** Centered flat-display stimulus angular width, reporting both the small-angle approximation and exact geometry in radians. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixels, millimetersPerPixel, viewingDistanceMm } = request;
  const compute = (): Output => {
    H.domain(pixels >= 0);
    H.positive(millimetersPerPixel);
    H.positive(viewingDistanceMm);
    return {
      millimeters: pixels * millimetersPerPixel,
      approximateRadians: (pixels * millimetersPerPixel) / viewingDistanceMm,
      exactRadians:
        2 * Math.atan((pixels * millimetersPerPixel) / (2 * viewingDistanceMm)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pixels: 100, millimetersPerPixel: 0.25, viewingDistanceMm: 500 },
  output: {
    millimeters: 25,
    approximateRadians: 0.05,
    exactRadians: 0.04998958723784032,
  },
} satisfies ToolExample<Input, Output>;
export const stimulusPixelVisualAngleSmallAngleTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "experimental-psychology/stimulus-pixel-visual-angle-small-angle-term",
      title: "Stimulus Pixel Visual Angle Small Angle Term Tool",
      description:
        "Centered flat-display stimulus angular width, reporting both the small-angle approximation and exact geometry in radians.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pixels: { type: "number", minimum: 0 },
          millimetersPerPixel: { type: "number", exclusiveMinimum: 0 },
          viewingDistanceMm: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["pixels", "millimetersPerPixel", "viewingDistanceMm"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          millimeters: { type: "number" },
          approximateRadians: { type: "number" },
          exactRadians: { type: "number" },
        },
        required: ["millimeters", "approximateRadians", "exactRadians"],
      },
      ports: {
        inputs: [
          {
            id: "pixels",
            label: "Pixels",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "millimetersPerPixel",
            label: "Millimeters Per Pixel",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "viewingDistanceMm",
            label: "Viewing Distance Mm",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "millimeters",
            label: "Millimeters",
            valueType: { type: "number" },
          },
          {
            id: "approximateRadians",
            label: "Approximate Radians",
            valueType: { type: "number", unit: "rad" },
          },
          {
            id: "exactRadians",
            label: "Exact Radians",
            valueType: { type: "number", unit: "rad" },
          },
        ],
      },
    },
    calculate,
  });
export const run = stimulusPixelVisualAngleSmallAngleTermTool.execute;
export default stimulusPixelVisualAngleSmallAngleTermTool;
