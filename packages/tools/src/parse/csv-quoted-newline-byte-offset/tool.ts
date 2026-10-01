import { utf8Encode } from "../../core/encoding.js";
import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly field: string };
export type Output = { readonly newlineByteOffsets: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { field: { type: "string", maxLength: 8192 } },
  required: ["field"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newlineByteOffsets: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["newlineByteOffsets"],
} as const;
/** Compute csv quoted newline byte offset from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { field } = input;
  const compute = (): Output => {
    domain(field.startsWith('"') && field.endsWith('"'));
    const newlineByteOffsets: number[] = [];
    for (let i = 0; i < field.length; i++)
      if (field[i] === "\n")
        newlineByteOffsets.push(utf8Encode(field.slice(0, i)).length);
    return { newlineByteOffsets };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { field: '"a\nb"' },
  output: { newlineByteOffsets: [2] },
} satisfies ToolExample<Input, Output>;
export const csvQuotedNewlineByteOffsetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/csv-quoted-newline-byte-offset",
  title: "CSV Quoted Newline Byte Offset Tool",
  description:
    "Compute csv quoted newline byte offset from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "field",
        label: "Field",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "newlineByteOffsets",
        label: "Newline Byte Offsets",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = csvQuotedNewlineByteOffsetTool.execute;
export default csvQuotedNewlineByteOffsetTool;
