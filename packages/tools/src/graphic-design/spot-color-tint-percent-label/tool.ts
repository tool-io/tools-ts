import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly spotName: string; readonly tintPercent: number };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spotName: { type: "string", maxLength: 8192, minLength: 1 },
    tintPercent: { type: "number", minimum: 0, maximum: 100 },
  },
  required: ["spotName", "tintPercent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a caller-supplied spot-color tint percentage without converting a color space or simulating ink. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spotName, tintPercent } = request;
  const compute = (): Output => {
    H.domain(spotName.length > 0, "spotName");
    H.domain(tintPercent >= 0 && tintPercent <= 100, "tintPercent");
    return { label: spotName + " " + tintPercent + "%" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spotName: "Spot Blue", tintPercent: 35 },
  output: { label: "Spot Blue 35%" },
} satisfies ToolExample<Input, Output>;
export const spotColorTintPercentLabelTool = H.defineSchemaCalculation<
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
    id: "graphic-design/spot-color-tint-percent-label",
    title: "Spot Color Tint Percent Label",
    description:
      "Label a caller-supplied spot-color tint percentage without converting a color space or simulating ink.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spotName: { type: "string", maxLength: 8192, minLength: 1 },
        tintPercent: { type: "number", minimum: 0, maximum: 100 },
      },
      required: ["spotName", "tintPercent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "spotName",
          label: "Spot Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "tintPercent",
          label: "Tint Percent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = spotColorTintPercentLabelTool.execute;
export default spotColorTintPercentLabelTool;
