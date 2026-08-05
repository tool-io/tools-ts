import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  numberFormats,
  parseNumber,
  type NumberFormat,
} from "../number/tool.js";

export type ParsedQuantity = { readonly unit: string; readonly value: number };
const validUnit = (unit: string): boolean =>
  unit.length <= 64 &&
  !/[\u0000-\u001f\u007f]/.test(unit) &&
  /^(?:\p{L}|[°µμ%$'"′″])/u.test(unit);

export const parseQuantity = (
  text: string,
  format: NumberFormat = "plain",
): ParsedQuantity | null => {
  const input = text.trim();
  for (let split = input.length - 1; split > 0; split -= 1) {
    const unit = input.slice(split).trim();
    if (!validUnit(unit)) continue;
    const value = parseNumber(input.slice(0, split).trim(), format);
    if (value !== null) return { unit, value };
  }
  return null;
};

export const quantityParserExample = {
  input: { format: "plain", text: "12.5 kg" },
  output: { unit: "kg", value: 12.5 },
} satisfies ToolExample<
  { readonly format: NumberFormat; readonly text: string },
  ParsedQuantity
>;

export const quantityParserTool = createSimpleTool({
  id: "parse/quantity",
  title: "Quantity with Unit Parser",
  description:
    "Parse a finite numeric value and preserve its attached unit without converting it.",
  inputs: [
    { id: "text", kind: "string", label: "Quantity" },
    {
      enum: numberFormats,
      id: "format",
      kind: "string",
      label: "Number format",
    },
  ],
  outputs: [
    { id: "value", kind: "number", label: "Value" },
    { id: "unit", kind: "string", label: "Unit" },
  ],
  calculate: (input) => {
    const result = parseQuantity(
      input.text as string,
      input.format as NumberFormat,
    );
    if (!result) simpleError("text", "Enter a number followed by a unit.");
    return result;
  },
});

export const runQuantityParser = quantityParserTool.execute;
export default quantityParserTool;
