import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly hValue: number; readonly referenceH: number };
export type Output = { readonly magnitudeOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hValue: { type: "number", exclusiveMinimum: 0 },
    referenceH: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["hValue", "referenceH"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { magnitudeOffset: { type: "number" } },
  required: ["magnitudeOffset"],
} as const;
/** Calculate the explicit -5 log10(h/h_ref) absolute-magnitude offset convention without fitting a distance ladder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hValue, referenceH } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(hValue) && hValue > 0, "hValue"), hValue);
    (H.domain(Number.isFinite(referenceH) && referenceH > 0, "referenceH"),
      referenceH);
    return {
      magnitudeOffset: -5 * (Math.log10(hValue) - Math.log10(referenceH)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hValue: 1, referenceH: 0.1 },
  output: { magnitudeOffset: -5 },
} satisfies ToolExample<Input, Output>;
export const magnitudeHubbleParameterOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cosmology", "physics"],
      keywords: ["cosmology", "physics"],
    },
    id: "cosmology/magnitude-hubble-parameter-offset",
    title: "Magnitude Hubble Parameter Offset",
    description:
      "Calculate the explicit -5 log10(h/h_ref) absolute-magnitude offset convention without fitting a distance ladder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hValue: { type: "number", exclusiveMinimum: 0 },
        referenceH: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["hValue", "referenceH"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { magnitudeOffset: { type: "number" } },
      required: ["magnitudeOffset"],
    },
    ports: {
      inputs: [
        {
          id: "hValue",
          label: "H Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceH",
          label: "Reference H",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "magnitudeOffset",
          label: "Magnitude Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = magnitudeHubbleParameterOffsetTool.execute;
export default magnitudeHubbleParameterOffsetTool;
