import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
  dateOnly,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly anchor: string; readonly offset: number };
export type Output = { readonly literal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anchor: { type: "string", maxLength: 8192 },
    offset: { type: "integer", minimum: -1000000, maximum: 1000000 },
  },
  required: ["anchor", "offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { literal: { type: "string", maxLength: 8192 } },
  required: ["literal"],
} as const;
/** Compute relative date anchor literal formatter from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { anchor, offset } = input;
  const compute = (): Output => {
    dateOnly(anchor);
    integer(offset, -1000000, 1000000);
    return { literal: anchor + (offset < 0 ? "" : "+") + offset + "D" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { anchor: "2024-01-01", offset: 3 },
  output: { literal: "2024-01-01+3D" },
} satisfies ToolExample<Input, Output>;
export const relativeDateAnchorLiteralFormatterTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/relative-date-anchor-literal-formatter",
  title: "Relative Date Anchor Literal Formatter Tool",
  description:
    "Compute relative date anchor literal formatter from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "anchor",
        label: "Anchor",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "offset",
        label: "Offset",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "literal", label: "Literal", valueType: { type: "string" } },
    ],
  },
});
export const run = relativeDateAnchorLiteralFormatterTool.execute;
export default relativeDateAnchorLiteralFormatterTool;
