import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPixels: number;
  readonly suppliedMicrometersPerPixel: number;
};
export type Output = { readonly lengthMicrometers: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPixels: { type: "number", minimum: 0 },
    suppliedMicrometersPerPixel: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredPixels", "suppliedMicrometersPerPixel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lengthMicrometers: { type: "number" } },
  required: ["lengthMicrometers"],
} as const;
/** Scale one explicit otolith pixel length by supplied micrometers per pixel without detecting increments or estimating age. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredPixels, suppliedMicrometersPerPixel } = request;
  const compute = (): Output => {
    H.domain(measuredPixels >= 0, "measuredPixels");
    (H.domain(
      Number.isFinite(suppliedMicrometersPerPixel) &&
        suppliedMicrometersPerPixel > 0,
      "suppliedMicrometersPerPixel",
    ),
      suppliedMicrometersPerPixel);
    return { lengthMicrometers: measuredPixels * suppliedMicrometersPerPixel };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredPixels: 120, suppliedMicrometersPerPixel: 2.5 },
  output: { lengthMicrometers: 300 },
} satisfies ToolExample<Input, Output>;
export const otolithImageCalibrationMicronsPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/otolith-image-calibration-microns-pair",
    title: "Otolith Image Calibration Microns Pair Tool",
    description:
      "Scale one explicit otolith pixel length by supplied micrometers per pixel without detecting increments or estimating age.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPixels: { type: "number", minimum: 0 },
        suppliedMicrometersPerPixel: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredPixels", "suppliedMicrometersPerPixel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lengthMicrometers: { type: "number" } },
      required: ["lengthMicrometers"],
    },
    ports: {
      inputs: [
        {
          id: "measuredPixels",
          label: "Measured Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMicrometersPerPixel",
          label: "Supplied Micrometers Per Pixel",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lengthMicrometers",
          label: "Length Micrometers",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = otolithImageCalibrationMicronsPairTool.execute;
export default otolithImageCalibrationMicronsPairTool;
