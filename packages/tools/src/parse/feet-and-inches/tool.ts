import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const parseFeetAndInches = (input: string): number | null => {
  const normalized = input.trim().replaceAll(",", ".");
  if (!normalized) return null;
  const compound = normalized.match(
    /^([+-]?)(\d+(?:\.\d+)?)\s*(?:'|ft)\s*(?:(\d+(?:\.\d+)?)\s*(?:"|in)?)?$/i,
  );
  if (compound) {
    const sign = compound[1] === "-" ? -1 : 1;
    const total = sign * (Number(compound[2]) * 12 + Number(compound[3] ?? 0));
    return Number.isFinite(total) ? total : null;
  }
  const total = Number(normalized) * 12;
  return Number.isFinite(total) ? total : null;
};

export const feetAndInchesParserExample = {
  input: { text: `5'10"` },
  output: { inches: 70 },
} satisfies ToolExample<{ readonly text: string }, { readonly inches: number }>;

export const feetAndInchesParserTool = createSimpleTool({
  id: "parse/feet-and-inches",
  title: "Feet and Inches Parser",
  description: "Parse feet and inches notation into total inches.",
  inputs: [{ id: "text", kind: "string", label: "Feet and inches" }],
  outputs: [
    { id: "inches", kind: "number", label: "Total inches", unit: "in" },
  ],
  calculate: (input) => {
    const inches = parseFeetAndInches(input.text as string);
    if (inches === null)
      simpleError("text", "Enter feet and inches notation or decimal feet.");
    return { inches };
  },
});

export const runFeetAndInchesParser = feetAndInchesParserTool.execute;
export default feetAndInchesParserTool;
