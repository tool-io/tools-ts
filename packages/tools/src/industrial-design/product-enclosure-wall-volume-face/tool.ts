import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly faceArea: number; readonly thickness: number };
export type Output = { readonly wallVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    faceArea: { type: "number", minimum: 0 },
    thickness: { type: "number", minimum: 0 },
  },
  required: ["faceArea", "thickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wallVolume: { type: "number" } },
  required: ["wallVolume"],
} as const;
/** Estimate one planar enclosure wall volume from net face area and uniform thickness, excluding edge overlaps and holes already removed from area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { faceArea, thickness } = request;
  const compute = (): Output => {
    H.domain(faceArea >= 0 && thickness >= 0, "faceArea");
    return { wallVolume: faceArea * thickness };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { faceArea: 120, thickness: 2 },
  output: { wallVolume: 240 },
} satisfies ToolExample<Input, Output>;
export const productEnclosureWallVolumeFaceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/product-enclosure-wall-volume-face",
    title: "Product Enclosure Wall Volume Face Tool",
    description:
      "Estimate one planar enclosure wall volume from net face area and uniform thickness, excluding edge overlaps and holes already removed from area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        faceArea: { type: "number", minimum: 0 },
        thickness: { type: "number", minimum: 0 },
      },
      required: ["faceArea", "thickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wallVolume: { type: "number" } },
      required: ["wallVolume"],
    },
    ports: {
      inputs: [
        {
          id: "faceArea",
          label: "Face Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wallVolume",
          label: "Wall Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = productEnclosureWallVolumeFaceTool.execute;
export default productEnclosureWallVolumeFaceTool;
