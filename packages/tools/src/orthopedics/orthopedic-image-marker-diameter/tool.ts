import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedMarkerPixels: number;
  readonly trueMarkerMillimeters: number;
};
export type Output = { readonly millimetersPerPixel: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMarkerPixels: { type: "number", exclusiveMinimum: 0 },
    trueMarkerMillimeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedMarkerPixels", "trueMarkerMillimeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { millimetersPerPixel: { type: "number" } },
  required: ["millimetersPerPixel"],
} as const;
/** Calculate a supplied orthopedic image-marker scale without assuming marker and anatomy are coplanar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedMarkerPixels, trueMarkerMillimeters } = request;
  const compute = (): Output => {
    (H.domain(observedMarkerPixels > 0, "observedMarkerPixels"),
      observedMarkerPixels);
    (H.domain(trueMarkerMillimeters > 0, "trueMarkerMillimeters"),
      trueMarkerMillimeters);
    return {
      millimetersPerPixel: trueMarkerMillimeters / observedMarkerPixels,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedMarkerPixels: 100, trueMarkerMillimeters: 25 },
  output: { millimetersPerPixel: 0.25 },
} satisfies ToolExample<Input, Output>;
export const orthopedicImageMarkerDiameterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["orthopedics", "health and medicine"],
      keywords: ["orthopedics", "health and medicine"],
    },
    id: "orthopedics/orthopedic-image-marker-diameter",
    title: "Orthopedic Image Marker Diameter",
    description:
      "Calculate a supplied orthopedic image-marker scale without assuming marker and anatomy are coplanar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedMarkerPixels: { type: "number", exclusiveMinimum: 0 },
        trueMarkerMillimeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedMarkerPixels", "trueMarkerMillimeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { millimetersPerPixel: { type: "number" } },
      required: ["millimetersPerPixel"],
    },
    ports: {
      inputs: [
        {
          id: "observedMarkerPixels",
          label: "Observed Marker Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trueMarkerMillimeters",
          label: "True Marker Millimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "millimetersPerPixel",
          label: "Millimeters Per Pixel",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = orthopedicImageMarkerDiameterTool.execute;
export default orthopedicImageMarkerDiameterTool;
