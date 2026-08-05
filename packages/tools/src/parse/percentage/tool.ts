import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  numberFormats,
  parseNumber,
  type NumberFormat,
} from "../number/tool.js";

export type PercentageInterpretation = "decimal" | "percent";

export const parsePercentage = (
  input: string,
  format: NumberFormat = "plain",
  interpretation: PercentageInterpretation = "percent",
): number | null => {
  const text = input.trim();
  const hasPercentSign = text.endsWith("%");
  if (text.includes("%") && !hasPercentSign) return null;
  const value = parseNumber(
    hasPercentSign ? text.slice(0, -1).trim() : text,
    format,
  );
  if (value === null) return null;
  const result =
    hasPercentSign || interpretation === "percent" ? value / 100 : value;
  return Number.isFinite(result) ? result : null;
};

export const percentageParserExample = {
  input: { format: "plain", interpretation: "percent", text: "12.5%" },
  output: { value: 0.125 },
} satisfies ToolExample<
  {
    readonly format: NumberFormat;
    readonly interpretation: PercentageInterpretation;
    readonly text: string;
  },
  { readonly value: number }
>;

export const percentageParserTool = createSimpleTool({
  id: "parse/percentage",
  title: "Percentage Parser",
  description: "Parse percentage text into its normalized decimal value.",
  inputs: [
    { id: "text", kind: "string", label: "Percentage" },
    {
      enum: numberFormats,
      id: "format",
      kind: "string",
      label: "Number format",
    },
    {
      enum: ["decimal", "percent"],
      id: "interpretation",
      kind: "string",
      label: "Number without percent sign",
    },
  ],
  outputs: [{ id: "value", kind: "number", label: "Decimal value" }],
  calculate: (input) => {
    const value = parsePercentage(
      input.text as string,
      input.format as NumberFormat,
      input.interpretation as PercentageInterpretation,
    );
    if (value === null) simpleError("text", "Enter a valid percentage.");
    return { value };
  },
});

export const runPercentageParser = percentageParserTool.execute;
export default percentageParserTool;
