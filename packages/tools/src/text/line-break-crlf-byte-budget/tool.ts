import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly text: string };
export type Output = {
  readonly lfCount: number;
  readonly crlfCount: number;
  readonly bytesAdded: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lfCount: { type: "integer" },
    crlfCount: { type: "integer" },
    bytesAdded: { type: "integer" },
  },
  required: ["lfCount", "crlfCount", "bytesAdded"],
} as const;
/** Compute line break crlf byte budget from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { text } = input;
  const compute = (): Output => {
    const crlfCount = (text.match(/\r\n/g) ?? []).length,
      lfCount = (text.match(/\n/g) ?? []).length - crlfCount;
    return { lfCount, crlfCount, bytesAdded: lfCount };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { text: "a\nb\r\nc" },
  output: { lfCount: 1, crlfCount: 1, bytesAdded: 1 },
} satisfies ToolExample<Input, Output>;
export const lineBreakCrlfByteBudgetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/line-break-crlf-byte-budget",
  title: "Line Break CRLF Byte Budget Tool",
  description:
    "Compute line break crlf byte budget from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "text",
        label: "Text",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "lfCount", label: "Lf Count", valueType: { type: "integer" } },
      { id: "crlfCount", label: "Crlf Count", valueType: { type: "integer" } },
      {
        id: "bytesAdded",
        label: "Bytes Added",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = lineBreakCrlfByteBudgetTool.execute;
export default lineBreakCrlfByteBudgetTool;
