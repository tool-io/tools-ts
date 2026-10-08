import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageDiameterPixels: number;
  readonly micrometersPerPixel: number;
};
export type Output = { readonly diameterMicrometers: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageDiameterPixels: { type: "number", minimum: 0 },
    micrometersPerPixel: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["imageDiameterPixels", "micrometersPerPixel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { diameterMicrometers: { type: "number" } },
  required: ["diameterMicrometers"],
} as const;
/** Convert an explicitly measured organoid image diameter using a supplied image-plane scale without estimating volume or biological quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageDiameterPixels, micrometersPerPixel } = request;
  const compute = (): Output => {
    H.domain(imageDiameterPixels >= 0, "imageDiameterPixels");
    (H.domain(micrometersPerPixel > 0, "micrometersPerPixel"),
      micrometersPerPixel);
    return { diameterMicrometers: imageDiameterPixels * micrometersPerPixel };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imageDiameterPixels: 120, micrometersPerPixel: 2 },
  output: { diameterMicrometers: 240 },
} satisfies ToolExample<Input, Output>;
export const organoidDiameterScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["developmental-biology", "developmental biology", "biology"],
      keywords: ["developmental biology", "biology"],
    },
    id: "developmental-biology/organoid-diameter-scale",
    title: "Organoid Diameter Scale",
    description:
      "Convert an explicitly measured organoid image diameter using a supplied image-plane scale without estimating volume or biological quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageDiameterPixels: { type: "number", minimum: 0 },
        micrometersPerPixel: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["imageDiameterPixels", "micrometersPerPixel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { diameterMicrometers: { type: "number" } },
      required: ["diameterMicrometers"],
    },
    ports: {
      inputs: [
        {
          id: "imageDiameterPixels",
          label: "Image Diameter Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "micrometersPerPixel",
          label: "Micrometers Per Pixel",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "diameterMicrometers",
          label: "Diameter Micrometers",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = organoidDiameterScaleTool.execute;
export default organoidDiameterScaleTool;
