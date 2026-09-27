import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly digits: string; readonly width: number };
export type Output = { readonly repetend: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digits: { type: "string", maxLength: 8192 },
    width: { type: "integer", maximum: 256 },
  },
  required: ["digits", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { repetend: { type: "string", maxLength: 8192 } },
  required: ["repetend"],
} as const;
/** Calculate decimal repetend leading zero padding from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { digits, width } = request;
  const compute = (): Output => {
    H.domain(/^\d+(?![\s\S])/.test(digits));
    H.integer(width, digits.length, 256);
    return { repetend: digits.padStart(width, "0") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { digits: "27", width: 3 },
  output: { repetend: "027" },
} satisfies ToolExample<Input, Output>;
export const decimalRepetendLeadingZeroPaddingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/decimal-repetend-leading-zero-padding",
    title: "Decimal Repetend Leading Zero Padding Tool",
    description:
      "Calculate decimal repetend leading zero padding from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        digits: { type: "string", maxLength: 8192 },
        width: { type: "integer", maximum: 256 },
      },
      required: ["digits", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { repetend: { type: "string", maxLength: 8192 } },
      required: ["repetend"],
    },
    ports: {
      inputs: [
        {
          id: "digits",
          label: "Digits",
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
        { id: "repetend", label: "Repetend", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = decimalRepetendLeadingZeroPaddingTool.execute;
export default decimalRepetendLeadingZeroPaddingTool;
