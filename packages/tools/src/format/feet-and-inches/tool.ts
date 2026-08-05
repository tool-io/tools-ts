import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const compact = (value: number): string => String(Number(value.toFixed(4)));
export const formatFeetAndInches = (totalInches: number): string => {
  const sign = totalInches < 0 ? "-" : "";
  const absolute = Math.abs(totalInches);
  const feet = Math.floor(absolute / 12);
  return `${sign}${feet}'${compact(absolute - feet * 12)}"`;
};

export const feetAndInchesFormatterExample = {
  input: { inches: 70 },
  output: { text: `5'10"` },
} satisfies ToolExample<{ readonly inches: number }, { readonly text: string }>;

export const feetAndInchesFormatterTool = createSimpleTool({
  id: "format/feet-and-inches",
  title: "Feet and Inches Formatter",
  description: "Format total inches as conventional feet and inches notation.",
  inputs: [{ id: "inches", kind: "number", label: "Total inches", unit: "in" }],
  outputs: [
    {
      format: "feet-and-inches",
      id: "text",
      kind: "string",
      label: "Feet and inches",
    },
  ],
  calculate: (input) => ({ text: formatFeetAndInches(input.inches as number) }),
});

export const runFeetAndInchesFormatter = feetAndInchesFormatterTool.execute;
export default feetAndInchesFormatterTool;
