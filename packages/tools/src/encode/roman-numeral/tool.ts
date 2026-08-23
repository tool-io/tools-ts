import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RomanNumeralInput = {
  readonly value: number;
};

export type RomanNumeralOutput = {
  readonly roman: string;
};

export const calculateRomanNumeral = (
  input: RomanNumeralInput,
): RomanNumeralOutput => {
  const table: readonly (readonly [number, string])[] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let remaining = input.value;
  let roman = "";
  for (const [amount, glyph] of table)
    while (remaining >= amount) {
      roman += glyph;
      remaining -= amount;
    }
  return { roman };
};

export const romanNumeralExample = {
  input: {
    value: 1994,
  },
  output: {
    roman: "MCMXCIV",
  },
} satisfies ToolExample<RomanNumeralInput, RomanNumeralOutput>;

export const romanNumeralTool = createSimpleTool({
  id: "encode/roman-numeral",
  title: "Roman Numeral Encoder",
  description:
    "Encode an integer from 1 to 3999 into its canonical subtractive Roman numeral.",
  inputs: [
    {
      description: "Integer value between 1 and 3999 inclusive.",
      id: "value",
      kind: "integer",
      label: "Value",
      minimum: 1,
      maximum: 3999,
    },
  ],
  outputs: [
    {
      description: "Canonical Roman numeral in standard subtractive notation.",
      id: "roman",
      kind: "string",
      label: "Roman numeral",
    },
  ],
  calculate: (input) => calculateRomanNumeral({ value: input.value as number }),
});

export const runRomanNumeral = romanNumeralTool.execute;
export default romanNumeralTool;
