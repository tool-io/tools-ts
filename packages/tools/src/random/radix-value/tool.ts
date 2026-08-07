import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateRandomInteger, type RandomSource } from "../number/tool.js";
export type SupportedRadix = 2 | 8 | 16;
export type RandomRadixValue = {
  readonly base: SupportedRadix;
  readonly decimal: number;
  readonly digits: string;
  readonly text: string;
};
const prefixes = { 2: "0b", 8: "0o", 16: "0x" } as const;
export const calculateRandomRadixValue = (
  minimum: number,
  maximum: number,
  width: number,
  base: SupportedRadix,
  includePrefix: boolean,
  random: RandomSource = Math.random,
): RandomRadixValue | null => {
  const decimal = calculateRandomInteger(minimum, maximum, random);
  if (decimal === null || minimum < 0 || width < 1 || width > 64) return null;
  const digits = decimal.toString(base).toUpperCase().padStart(width, "0");
  return {
    base,
    decimal,
    digits,
    text: `${includePrefix ? prefixes[base] : ""}${digits}`,
  };
};
export const randomRadixValueExample = {
  input: {
    base: "16",
    includePrefix: true,
    maximum: 255,
    minimum: 0,
    width: 2,
  },
} satisfies ToolExample<{
  readonly base: string;
  readonly includePrefix: boolean;
  readonly maximum: number;
  readonly minimum: number;
  readonly width: number;
}>;
export const randomRadixValueTool = createSimpleTool({
  id: "random/radix-value",
  title: "Random Base Number Generator",
  description:
    "Generate a random nonnegative integer formatted in binary, octal, or hexadecimal.",
  inputs: [
    { id: "minimum", kind: "integer", label: "Minimum", minimum: 0 },
    { id: "maximum", kind: "integer", label: "Maximum", minimum: 0 },
    {
      id: "width",
      kind: "integer",
      label: "Minimum width",
      maximum: 64,
      minimum: 1,
    },
    { enum: ["2", "8", "16"], id: "base", kind: "string", label: "Base" },
    {
      default: true,
      id: "includePrefix",
      kind: "boolean",
      label: "Include prefix",
    },
  ],
  outputs: [
    {
      format: "random/radix-value",
      id: "result",
      kind: "object",
      label: "Random base number",
    },
  ],
  calculate: (input, context) => {
    const result = calculateRandomRadixValue(
      input.minimum as number,
      input.maximum as number,
      input.width as number,
      Number(input.base) as SupportedRadix,
      input.includePrefix as boolean,
      context.random ?? Math.random,
    );
    if (!result)
      return simpleError(
        "maximum",
        "Enter an ordered nonnegative safe-integer range.",
      );
    return { result };
  },
});
export const runRandomRadixValue = randomRadixValueTool.execute;
export default randomRadixValueTool;
