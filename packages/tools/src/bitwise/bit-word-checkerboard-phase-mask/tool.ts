import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly width: number; readonly odd: boolean };
export type Output = { readonly mask: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "integer", minimum: 1, maximum: 32 },
    odd: { type: "boolean" },
  },
  required: ["width", "odd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mask: { type: "integer" } },
  required: ["mask"],
} as const;
/** Calculate bit word checkerboard phase mask from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { width, odd } = input;
  const compute = (): Output => {
    H.integer(width, 1, 32);
    let mask = 0;
    for (let i = odd ? 1 : 0; i < width; i += 2) mask += 2 ** i;
    return { mask };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { width: 8, odd: false },
  output: { mask: 85 },
} satisfies ToolExample<Input, Output>;
export const bitWordCheckerboardPhaseMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/bit-word-checkerboard-phase-mask",
    title: "Bit Word Checkerboard Phase Mask Tool",
    description:
      "Calculate bit word checkerboard phase mask from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "integer", minimum: 1, maximum: 32 },
        odd: { type: "boolean" },
      },
      required: ["width", "odd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mask: { type: "integer" } },
      required: ["mask"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "odd",
          label: "Odd",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "mask", label: "Mask", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = bitWordCheckerboardPhaseMaskTool.execute;
export default bitWordCheckerboardPhaseMaskTool;
