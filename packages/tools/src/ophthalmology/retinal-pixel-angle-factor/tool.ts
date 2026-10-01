import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixels: number;
  readonly radiansPerPixel: number;
};
export type Output = { readonly angleRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixels: { type: "number", minimum: 0 },
    radiansPerPixel: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pixels", "radiansPerPixel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angleRadians: { type: "number" } },
  required: ["angleRadians"],
} as const;
/** Apply a supplied retinal research image angular calibration, without inferring retinal anatomy or disease. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixels, radiansPerPixel } = request;
  const compute = (): Output => {
    H.domain(pixels >= 0);
    H.positive(radiansPerPixel);
    return { angleRadians: pixels * radiansPerPixel };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pixels: 120, radiansPerPixel: 0.001 },
  output: { angleRadians: 0.12 },
} satisfies ToolExample<Input, Output>;
export const retinalPixelAngleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/retinal-pixel-angle-factor",
    title: "Retinal Pixel Angle Factor Tool",
    description:
      "Apply a supplied retinal research image angular calibration, without inferring retinal anatomy or disease.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixels: { type: "number", minimum: 0 },
        radiansPerPixel: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pixels", "radiansPerPixel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { angleRadians: { type: "number" } },
      required: ["angleRadians"],
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
          id: "radiansPerPixel",
          label: "Radians Per Pixel",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "angleRadians",
          label: "Angle Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = retinalPixelAngleFactorTool.execute;
export default retinalPixelAngleFactorTool;
