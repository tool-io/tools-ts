import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annotationPixels: number;
  readonly suppliedPhysicalUnitsPerPixel: number;
};
export type Output = { readonly physicalLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annotationPixels: { type: "number", minimum: 0 },
    suppliedPhysicalUnitsPerPixel: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["annotationPixels", "suppliedPhysicalUnitsPerPixel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { physicalLength: { type: "number" } },
  required: ["physicalLength"],
} as const;
/** Convert a supplied histology annotation pixel length using explicit positive physical units per pixel without image calibration inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { annotationPixels, suppliedPhysicalUnitsPerPixel } = request;
  const compute = (): Output => {
    H.domain(annotationPixels >= 0, "annotationPixels");
    (H.domain(
      Number.isFinite(suppliedPhysicalUnitsPerPixel) &&
        suppliedPhysicalUnitsPerPixel > 0,
      "suppliedPhysicalUnitsPerPixel",
    ),
      suppliedPhysicalUnitsPerPixel);
    return { physicalLength: annotationPixels * suppliedPhysicalUnitsPerPixel };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { annotationPixels: 120, suppliedPhysicalUnitsPerPixel: 0.5 },
  output: { physicalLength: 60 },
} satisfies ToolExample<Input, Output>;
export const histologyAnnotationPixelScaleCorrectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "histology/histology-annotation-pixel-scale-correction",
      title: "Histology Annotation Pixel Scale Correction Tool",
      description:
        "Convert a supplied histology annotation pixel length using explicit positive physical units per pixel without image calibration inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          annotationPixels: { type: "number", minimum: 0 },
          suppliedPhysicalUnitsPerPixel: {
            type: "number",
            exclusiveMinimum: 0,
          },
        },
        required: ["annotationPixels", "suppliedPhysicalUnitsPerPixel"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { physicalLength: { type: "number" } },
        required: ["physicalLength"],
      },
      ports: {
        inputs: [
          {
            id: "annotationPixels",
            label: "Annotation Pixels",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedPhysicalUnitsPerPixel",
            label: "Supplied Physical Units Per Pixel",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "physicalLength",
            label: "Physical Length",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = histologyAnnotationPixelScaleCorrectionTool.execute;
export default histologyAnnotationPixelScaleCorrectionTool;
