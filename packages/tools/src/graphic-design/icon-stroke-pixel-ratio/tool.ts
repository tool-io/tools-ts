import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly strokeWidthPixels: number;
  readonly iconWidthPixels: number;
};
export type Output = { readonly relativeStrokeWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strokeWidthPixels: { type: "number", minimum: 0 },
    iconWidthPixels: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["strokeWidthPixels", "iconWidthPixels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeStrokeWidth: { type: "number" } },
  required: ["relativeStrokeWidth"],
} as const;
/** Normalize a supplied icon stroke width to its positive display width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { strokeWidthPixels, iconWidthPixels } = request;
  const compute = (): Output => {
    H.domain(strokeWidthPixels >= 0, "strokeWidthPixels");
    (H.domain(iconWidthPixels > 0, "iconWidthPixels"), iconWidthPixels);
    return { relativeStrokeWidth: strokeWidthPixels / iconWidthPixels };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { strokeWidthPixels: 2, iconWidthPixels: 24 },
  output: { relativeStrokeWidth: 0.08333333333333333 },
} satisfies ToolExample<Input, Output>;
export const iconStrokePixelRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["graphic-design", "graphic design", "arts and design"],
      keywords: ["graphic design", "arts and design"],
    },
    id: "graphic-design/icon-stroke-pixel-ratio",
    title: "Icon Stroke Pixel Ratio",
    description:
      "Normalize a supplied icon stroke width to its positive display width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        strokeWidthPixels: { type: "number", minimum: 0 },
        iconWidthPixels: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["strokeWidthPixels", "iconWidthPixels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeStrokeWidth: { type: "number" } },
      required: ["relativeStrokeWidth"],
    },
    ports: {
      inputs: [
        {
          id: "strokeWidthPixels",
          label: "Stroke Width Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "iconWidthPixels",
          label: "Icon Width Pixels",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeStrokeWidth",
          label: "Relative Stroke Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = iconStrokePixelRatioTool.execute;
export default iconStrokePixelRatioTool;
