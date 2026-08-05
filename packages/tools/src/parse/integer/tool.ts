import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  numberFormats,
  parseNumber,
  type NumberFormat,
} from "../number/tool.js";

export const parseInteger = (
  input: unknown,
  format: NumberFormat = "plain",
): number | null => {
  const value = parseNumber(input, format);
  return value !== null && Number.isSafeInteger(value) ? value : null;
};

export const integerParserExample = {
  input: { format: "en-US", text: "1,234" },
  output: { value: 1234 },
} satisfies ToolExample<
  { readonly format: NumberFormat; readonly text: string },
  { readonly value: number }
>;

export const integerParserTool = createSimpleTool({
  id: "parse/integer",
  title: "Text to Integer Converter",
  description: "Parse explicitly formatted numeric text into a safe integer.",
  inputs: [
    { id: "text", kind: "string", label: "Text" },
    {
      enum: numberFormats,
      id: "format",
      kind: "string",
      label: "Number format",
    },
  ],
  outputs: [{ id: "value", kind: "integer", label: "Integer" }],
  calculate: (input) => {
    const value = parseInteger(input.text, input.format as NumberFormat);
    if (value === null)
      simpleError("text", "Enter a safe integer matching the selected format.");
    return { value };
  },
});

export const runIntegerParser = integerParserTool.execute;
export default integerParserTool;
