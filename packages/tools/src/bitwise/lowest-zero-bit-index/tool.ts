import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly wordDecimal: string; readonly width: number };
export type Output = { readonly found: boolean; readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wordDecimal: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["wordDecimal", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { found: { type: "boolean" }, index: { type: "integer" } },
  required: ["found", "index"],
} as const;
/** Calculate lowest zero bit index from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wordDecimal, width } = request;
  const compute = (): Output => {
    H.integer(width, 1, 256);
    const n = H.decimal(wordDecimal);
    H.domain(n >= 0n && n < 1n << BigInt(width));
    let index = -1;
    for (let i = 0; i < width; i++)
      if (((n >> BigInt(i)) & 1n) === 0n) {
        index = i;
        break;
      }
    return { found: index >= 0, index };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wordDecimal: "11", width: 4 },
  output: { found: true, index: 2 },
} satisfies ToolExample<Input, Output>;
export const lowestZeroBitIndexTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "bitwise/lowest-zero-bit-index",
    title: "Lowest Zero Bit Index Tool",
    description:
      "Calculate lowest zero bit index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wordDecimal: { type: "string", maxLength: 8192 },
        width: { type: "integer", minimum: 1, maximum: 256 },
      },
      required: ["wordDecimal", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { found: { type: "boolean" }, index: { type: "integer" } },
      required: ["found", "index"],
    },
    ports: {
      inputs: [
        {
          id: "wordDecimal",
          label: "Word Decimal",
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
      outputs: [
        { id: "found", label: "Found", valueType: { type: "boolean" } },
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = lowestZeroBitIndexTool.execute;
export default lowestZeroBitIndexTool;
