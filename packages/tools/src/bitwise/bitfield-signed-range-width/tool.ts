import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly minimum: number; readonly maximum: number };
export type Output = { readonly width: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimum: { type: "integer", minimum: -2147483648 },
    maximum: { type: "integer", maximum: 2147483647 },
  },
  required: ["minimum", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "integer" } },
  required: ["width"],
} as const;
/** Calculate bitfield signed range width from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { minimum, maximum } = input;
  const compute = (): Output => {
    H.domain(
      minimum <= maximum && minimum >= -2147483648 && maximum <= 2147483647,
    );
    let width = 1;
    while (minimum < -(2 ** (width - 1)) || maximum > 2 ** (width - 1) - 1)
      width++;
    return { width };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { minimum: -8, maximum: 7 },
  output: { width: 4 },
} satisfies ToolExample<Input, Output>;
export const bitfieldSignedRangeWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/bitfield-signed-range-width",
    title: "Bitfield Signed Range Width Tool",
    description:
      "Calculate bitfield signed range width from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimum: { type: "integer", minimum: -2147483648 },
        maximum: { type: "integer", maximum: 2147483647 },
      },
      required: ["minimum", "maximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "integer" } },
      required: ["width"],
    },
    ports: {
      inputs: [
        {
          id: "minimum",
          label: "Minimum",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "maximum",
          label: "Maximum",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = bitfieldSignedRangeWidthTool.execute;
export default bitfieldSignedRangeWidthTool;
