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
export type Input = {
  readonly resetWord: string;
  readonly offset: number;
  readonly length: number;
  readonly width: number;
};
export type Output = { readonly field: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resetWord: { type: "string", maxLength: 8192 },
    offset: { type: "integer", minimum: 0 },
    length: { type: "integer", minimum: 1 },
    width: { type: "integer", minimum: 1, maximum: 128 },
  },
  required: ["resetWord", "offset", "length", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { field: { type: "string", maxLength: 8192 } },
  required: ["field"],
} as const;
/** Compute register field reset value extractor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { resetWord, offset, length, width } = input;
  const compute = (): Output => {
    integer(width, 1, 128);
    integer(offset, 0, width - 1);
    integer(length, 1, width - offset);
    const w = decimal(resetWord);
    domain(w >= 0n && w < 1n << BigInt(width));
    return {
      field: ((w >> BigInt(offset)) & ((1n << BigInt(length)) - 1n)).toString(),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { resetWord: "172", offset: 2, length: 3, width: 8 },
  output: { field: "3" },
} satisfies ToolExample<Input, Output>;
export const registerFieldResetValueExtractorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/register-field-reset-value-extractor",
  title: "Register Field Reset Value Extractor Tool",
  description:
    "Compute register field reset value extractor from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "resetWord",
        label: "Reset Word",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "offset",
        label: "Offset",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "length",
        label: "Length",
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
    outputs: [{ id: "field", label: "Field", valueType: { type: "string" } }],
  },
});
export const run = registerFieldResetValueExtractorTool.execute;
export default registerFieldResetValueExtractorTool;
