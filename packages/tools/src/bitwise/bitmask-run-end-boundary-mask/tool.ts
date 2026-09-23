import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly word: string; readonly width: number };
export type Output = { readonly mask: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 128 },
  },
  required: ["word", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mask: { type: "string", maxLength: 8192 } },
  required: ["mask"],
} as const;
/** Compute bitmask run end boundary mask from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { word, width } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    const w = decimal(word),
      mask = (1n << BigInt(width)) - 1n;
    domain(w >= 0n && w <= mask);
    return { mask: (w & ~(w >> 1n) & mask).toString() };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: "28", width: 8 },
  output: { mask: "16" },
} satisfies ToolExample<Input, Output>;
export const bitmaskRunEndBoundaryMaskTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "bitwise/bitmask-run-end-boundary-mask",
  title: "Bitmask Run End Boundary Mask Tool",
  description:
    "Compute bitmask run end boundary mask from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "word",
        label: "Word",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "width",
        label: "Width",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "mask", label: "Mask", valueType: { type: "string" } }],
  },
});
export const run = bitmaskRunEndBoundaryMaskTool.execute;
export default bitmaskRunEndBoundaryMaskTool;
