import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixelCount: number;
  readonly areaPerPixel: number;
};
export type Output = { readonly area: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixelCount: { type: "integer", minimum: 0 },
    areaPerPixel: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pixelCount", "areaPerPixel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { area: { type: "number" } },
  required: ["area"],
} as const;
/** Convert a supplied research-image area count with explicit calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixelCount, areaPerPixel } = request;
  const compute = (): Output => {
    H.integer(pixelCount, 0);
    H.positive(areaPerPixel);
    return { area: pixelCount * areaPerPixel };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pixelCount: 120, areaPerPixel: 0.25 },
  output: { area: 30 },
} satisfies ToolExample<Input, Output>;
export const endoscopyRegionAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/endoscopy-region-area-factor",
    title: "Endoscopy Region Area Factor Tool",
    description:
      "Convert a supplied research-image area count with explicit calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixelCount: { type: "integer", minimum: 0 },
        areaPerPixel: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pixelCount", "areaPerPixel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { area: { type: "number" } },
      required: ["area"],
    },
    ports: {
      inputs: [
        {
          id: "pixelCount",
          label: "Pixel Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "areaPerPixel",
          label: "Area Per Pixel",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "area", label: "Area", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = endoscopyRegionAreaFactorTool.execute;
export default endoscopyRegionAreaFactorTool;
