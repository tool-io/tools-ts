import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NumberFormat = "de-DE" | "en-US" | "fr-FR" | "plain";
export const numberFormats = ["de-DE", "en-US", "fr-FR", "plain"] as const;
const plainNumber = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
const usNumber = /^[+-]?(?:(?:\d{1,3}(?:,\d{3})+)|\d+)(?:\.\d+)?$/;
const germanNumber = /^[+-]?(?:(?:\d{1,3}(?:\.\d{3})+)|\d+)(?:,\d+)?$/;
const frenchNumber = /^[+-]?(?:(?:\d{1,3}(?: \d{3})+)|\d+)(?:,\d+)?$/;

export const parseNumber = (
  input: unknown,
  format: NumberFormat = "plain",
): number | null => {
  if (!numberFormats.includes(format)) return null;
  if (typeof input === "number") return Number.isFinite(input) ? input : null;
  if (typeof input !== "string") return null;
  let text = input.trim().replace(/^\u2212/, "-");
  if (text === "") return null;
  let normalized: string;
  if (format === "plain") {
    if (!plainNumber.test(text)) return null;
    normalized = text;
  } else if (format === "en-US") {
    if (!usNumber.test(text)) return null;
    normalized = text.replaceAll(",", "");
  } else if (format === "de-DE") {
    if (!germanNumber.test(text)) return null;
    normalized = text.replaceAll(".", "").replace(",", ".");
  } else {
    text = text.replace(/[\u00a0\u202f]/g, " ");
    if (!frenchNumber.test(text)) return null;
    normalized = text.replaceAll(" ", "").replace(",", ".");
  }
  const value = Number(normalized);
  return Number.isFinite(value) ? (Object.is(value, -0) ? 0 : value) : null;
};

export const numberParserExample = {
  input: { format: "en-US", text: "1,234.56" },
  output: { value: 1234.56 },
} satisfies ToolExample<
  { readonly format: NumberFormat; readonly text: string },
  { readonly value: number }
>;

export const numberParserTool = createSimpleTool({
  id: "parse/number",
  title: "Text to Number Converter",
  description: "Parse explicitly formatted numeric text into a finite number.",
  inputs: [
    { id: "text", kind: "string", label: "Text" },
    {
      enum: numberFormats,
      id: "format",
      kind: "string",
      label: "Number format",
    },
  ],
  outputs: [{ id: "value", kind: "number", label: "Number" }],
  calculate: (input) => {
    const value = parseNumber(input.text, input.format as NumberFormat);
    if (value === null)
      simpleError("text", "Enter a number matching the selected format.");
    return { value };
  },
});

export const runNumberParser = numberParserTool.execute;
export default numberParserTool;
