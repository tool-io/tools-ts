import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markerPhysicalLength: number;
  readonly markerImagePixels: number;
  readonly measuredImagePixels: number;
};
export type Output = {
  readonly physicalLength: number;
  readonly unitsPerPixel: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markerPhysicalLength: { type: "number", exclusiveMinimum: 0 },
    markerImagePixels: { type: "number", exclusiveMinimum: 0 },
    measuredImagePixels: { type: "number", minimum: 0 },
  },
  required: [
    "markerPhysicalLength",
    "markerImagePixels",
    "measuredImagePixels",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physicalLength: { type: "number" },
    unitsPerPixel: { type: "number" },
  },
  required: ["physicalLength", "unitsPerPixel"],
} as const;
/** Scale an image-plane measurement from a coplanar scale marker, assuming uniform magnification and no perspective distortion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markerPhysicalLength, markerImagePixels, measuredImagePixels } =
    request;
  const compute = (): Output => {
    (H.domain(markerPhysicalLength > 0, "markerPhysicalLength"),
      markerPhysicalLength);
    (H.domain(markerImagePixels > 0, "markerImagePixels"), markerImagePixels);
    H.domain(measuredImagePixels >= 0, "measuredImagePixels");
    return {
      physicalLength:
        (measuredImagePixels * markerPhysicalLength) / markerImagePixels,
      unitsPerPixel: markerPhysicalLength / markerImagePixels,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    markerPhysicalLength: 10,
    markerImagePixels: 200,
    measuredImagePixels: 350,
  },
  output: { physicalLength: 17.5, unitsPerPixel: 0.05 },
} satisfies ToolExample<Input, Output>;
export const artPhotoScaleMarkerRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/art-photo-scale-marker-ratio",
    title: "Art Photo Scale Marker Ratio Tool",
    description:
      "Scale an image-plane measurement from a coplanar scale marker, assuming uniform magnification and no perspective distortion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markerPhysicalLength: { type: "number", exclusiveMinimum: 0 },
        markerImagePixels: { type: "number", exclusiveMinimum: 0 },
        measuredImagePixels: { type: "number", minimum: 0 },
      },
      required: [
        "markerPhysicalLength",
        "markerImagePixels",
        "measuredImagePixels",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        physicalLength: { type: "number" },
        unitsPerPixel: { type: "number" },
      },
      required: ["physicalLength", "unitsPerPixel"],
    },
    ports: {
      inputs: [
        {
          id: "markerPhysicalLength",
          label: "Marker Physical Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "markerImagePixels",
          label: "Marker Image Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredImagePixels",
          label: "Measured Image Pixels",
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
        {
          id: "unitsPerPixel",
          label: "Units Per Pixel",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artPhotoScaleMarkerRatioTool.execute;
export default artPhotoScaleMarkerRatioTool;
