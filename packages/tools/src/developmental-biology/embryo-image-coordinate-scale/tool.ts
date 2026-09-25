import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixelCoordinate: number;
  readonly pixelOrigin: number;
  readonly unitsPerPixel: number;
  readonly physicalOrigin: number;
};
export type Output = { readonly physicalCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixelCoordinate: { type: "number" },
    pixelOrigin: { type: "number" },
    unitsPerPixel: { type: "number", exclusiveMinimum: 0 },
    physicalOrigin: { type: "number" },
  },
  required: [
    "pixelCoordinate",
    "pixelOrigin",
    "unitsPerPixel",
    "physicalOrigin",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { physicalCoordinate: { type: "number" } },
  required: ["physicalCoordinate"],
} as const;
/** Transform a supplied research-image coordinate under explicit origin and scale calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixelCoordinate, pixelOrigin, unitsPerPixel, physicalOrigin } =
    request;
  const compute = (): Output => {
    H.positive(unitsPerPixel);
    return {
      physicalCoordinate:
        physicalOrigin + (pixelCoordinate - pixelOrigin) * unitsPerPixel,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pixelCoordinate: 120,
    pixelOrigin: 20,
    unitsPerPixel: 0.5,
    physicalOrigin: 10,
  },
  output: { physicalCoordinate: 60 },
} satisfies ToolExample<Input, Output>;
export const embryoImageCoordinateScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/embryo-image-coordinate-scale",
    title: "Embryo Image Coordinate Scale Tool",
    description:
      "Transform a supplied research-image coordinate under explicit origin and scale calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixelCoordinate: { type: "number" },
        pixelOrigin: { type: "number" },
        unitsPerPixel: { type: "number", exclusiveMinimum: 0 },
        physicalOrigin: { type: "number" },
      },
      required: [
        "pixelCoordinate",
        "pixelOrigin",
        "unitsPerPixel",
        "physicalOrigin",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { physicalCoordinate: { type: "number" } },
      required: ["physicalCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "pixelCoordinate",
          label: "Pixel Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pixelOrigin",
          label: "Pixel Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitsPerPixel",
          label: "Units Per Pixel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "physicalOrigin",
          label: "Physical Origin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "physicalCoordinate",
          label: "Physical Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = embryoImageCoordinateScaleTool.execute;
export default embryoImageCoordinateScaleTool;
