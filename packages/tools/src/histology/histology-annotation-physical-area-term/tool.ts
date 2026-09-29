import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixelArea: number;
  readonly xMicronsPerPixel: number;
  readonly yMicronsPerPixel: number;
};
export type Output = {
  readonly squareMicrons: number;
  readonly squareMillimeters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixelArea: { type: "number", minimum: 0 },
    xMicronsPerPixel: { type: "number", exclusiveMinimum: 0 },
    yMicronsPerPixel: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pixelArea", "xMicronsPerPixel", "yMicronsPerPixel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    squareMicrons: { type: "number" },
    squareMillimeters: { type: "number" },
  },
  required: ["squareMicrons", "squareMillimeters"],
} as const;
/** Anisotropic pixel-area calibration with one million square micrometers per square millimeter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixelArea, xMicronsPerPixel, yMicronsPerPixel } = request;
  const compute = (): Output => {
    H.domain(pixelArea >= 0);
    H.positive(xMicronsPerPixel);
    H.positive(yMicronsPerPixel);
    return {
      squareMicrons: pixelArea * xMicronsPerPixel * yMicronsPerPixel,
      squareMillimeters:
        (pixelArea * xMicronsPerPixel * yMicronsPerPixel) / 1e6,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pixelArea: 1000000, xMicronsPerPixel: 0.5, yMicronsPerPixel: 0.5 },
  output: { squareMicrons: 250000, squareMillimeters: 0.25 },
} satisfies ToolExample<Input, Output>;
export const histologyAnnotationPhysicalAreaTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "histology/histology-annotation-physical-area-term",
      title: "Histology Annotation Physical Area Term Tool",
      description:
        "Anisotropic pixel-area calibration with one million square micrometers per square millimeter.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pixelArea: { type: "number", minimum: 0 },
          xMicronsPerPixel: { type: "number", exclusiveMinimum: 0 },
          yMicronsPerPixel: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["pixelArea", "xMicronsPerPixel", "yMicronsPerPixel"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          squareMicrons: { type: "number" },
          squareMillimeters: { type: "number" },
        },
        required: ["squareMicrons", "squareMillimeters"],
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
            id: "xMicronsPerPixel",
            label: "X Microns Per Pixel",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "yMicronsPerPixel",
            label: "Y Microns Per Pixel",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "squareMicrons",
            label: "Square Microns",
            valueType: { type: "number" },
          },
          {
            id: "squareMillimeters",
            label: "Square Millimeters",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = histologyAnnotationPhysicalAreaTermTool.execute;
export default histologyAnnotationPhysicalAreaTermTool;
