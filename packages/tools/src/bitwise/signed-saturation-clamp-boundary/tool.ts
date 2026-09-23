import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number; readonly width: number };
export type Output = { readonly value: number; readonly saturated: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "integer" },
    width: { type: "integer", minimum: 2, maximum: 32 },
  },
  required: ["value", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" }, saturated: { type: "boolean" } },
  required: ["value", "saturated"],
} as const;
/** Calculate signed saturation clamp boundary from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value, width } = input;
  const compute = (): Output => {
    H.integer(width, 2, 32);
    const lower = -(2 ** (width - 1)),
      upper = 2 ** (width - 1) - 1,
      v = Math.max(lower, Math.min(upper, value));
    return { value: v, saturated: v !== value };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 200, width: 8 },
  output: { value: 127, saturated: true },
} satisfies ToolExample<Input, Output>;
export const signedSaturationClampBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/signed-saturation-clamp-boundary",
    title: "Signed Saturation Clamp Boundary Tool",
    description:
      "Calculate signed saturation clamp boundary from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "integer" },
        width: { type: "integer", minimum: 2, maximum: 32 },
      },
      required: ["value", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "integer" },
        saturated: { type: "boolean" },
      },
      required: ["value", "saturated"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "integer" } },
        { id: "saturated", label: "Saturated", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = signedSaturationClampBoundaryTool.execute;
export default signedSaturationClampBoundaryTool;
