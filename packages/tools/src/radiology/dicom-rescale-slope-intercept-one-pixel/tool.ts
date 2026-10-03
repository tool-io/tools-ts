import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly storedPixel: number;
  readonly slope: number;
  readonly intercept: number;
};
export type Output = { readonly modalityValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storedPixel: { type: "number" },
    slope: { type: "number" },
    intercept: { type: "number" },
  },
  required: ["storedPixel", "slope", "intercept"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { modalityValue: { type: "number" } },
  required: ["modalityValue"],
} as const;
/** DICOM modality rescale value m*SV+b for one explicitly supplied stored value, without display windowing or interpreting physical units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { storedPixel, slope, intercept } = request;
  const compute = (): Output => {
    return { modalityValue: storedPixel * slope + intercept };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { storedPixel: 100, slope: 2, intercept: -100 },
  output: { modalityValue: 100 },
} satisfies ToolExample<Input, Output>;
export const dicomRescaleSlopeInterceptOnePixelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/dicom-rescale-slope-intercept-one-pixel",
    title: "DICOM Rescale Slope Intercept One Pixel Tool",
    description:
      "DICOM modality rescale value m*SV+b for one explicitly supplied stored value, without display windowing or interpreting physical units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        storedPixel: { type: "number" },
        slope: { type: "number" },
        intercept: { type: "number" },
      },
      required: ["storedPixel", "slope", "intercept"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { modalityValue: { type: "number" } },
      required: ["modalityValue"],
    },
    ports: {
      inputs: [
        {
          id: "storedPixel",
          label: "Stored Pixel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intercept",
          label: "Intercept",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "modalityValue",
          label: "Modality Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomRescaleSlopeInterceptOnePixelTool.execute;
export default dicomRescaleSlopeInterceptOnePixelTool;
