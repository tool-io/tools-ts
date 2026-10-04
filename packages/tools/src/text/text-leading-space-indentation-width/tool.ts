import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly line: string; readonly tabWidth: number };
export type Output = { readonly columns: number; readonly characters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    line: { type: "string", maxLength: 8192 },
    tabWidth: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["line", "tabWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { columns: { type: "integer" }, characters: { type: "integer" } },
  required: ["columns", "characters"],
} as const;
/** Compute text leading space indentation width from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { line, tabWidth } = input;
  const compute = (): Output => {
    integer(tabWidth, 1, 32);
    let columns = 0,
      characters = 0;
    for (const c of line) {
      if (c !== " " && c !== "\t") break;
      columns += c === " " ? 1 : tabWidth - (columns % tabWidth);
      characters++;
    }
    return { columns, characters };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { line: " \tx", tabWidth: 4 },
  output: { columns: 4, characters: 2 },
} satisfies ToolExample<Input, Output>;
export const textLeadingSpaceIndentationWidthTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/text-leading-space-indentation-width",
  title: "Text Leading Space Indentation Width Tool",
  description:
    "Compute text leading space indentation width from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "line",
        label: "Line",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "tabWidth",
        label: "Tab Width",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "columns", label: "Columns", valueType: { type: "integer" } },
      { id: "characters", label: "Characters", valueType: { type: "integer" } },
    ],
  },
});
export const run = textLeadingSpaceIndentationWidthTool.execute;
export default textLeadingSpaceIndentationWidthTool;
