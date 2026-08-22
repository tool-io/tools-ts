import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const decimalToRomanExample = {
  input: { value: 1987 },
  output: { roman: "MCMLXXXVII" },
} satisfies ToolExample<DecimalToRomanInput, DecimalToRomanOutput>;

type DecimalToRomanInput = { readonly value: number };
type DecimalToRomanOutput = { readonly roman: string };

const TABLE: readonly [number, string][] = [
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

export const calculateDecimalToRoman = (
  input: DecimalToRomanInput,
): DecimalToRomanOutput => {
  const value = input.value as number;
  if (value <= 0 || value > 3999)
    simpleError(
      "value",
      "Provide a value between one and three thousand nine hundred ninety-nine.",
      "out_of_range",
    );
  let remaining = value;
  let result = "";
  for (const [arabic, numeral] of TABLE) {
    while (remaining >= arabic) {
      result += numeral;
      remaining -= arabic;
    }
  }
  return { roman: result };
};

export const decimalToRomanTool = createSimpleTool({
  calculate: (input) =>
    calculateDecimalToRoman(input as unknown as DecimalToRomanInput),
  description:
    "Convert a positive integer between one and 3999 to its Roman numeral representation.",
  id: "convert/decimal-to-roman",
  inputs: [
    {
      description: "Integer to convert.",
      id: "value",
      kind: "integer",
      label: "Value",
      maximum: 3999,
      minimum: 1,
    },
  ],
  outputs: [{ id: "roman", kind: "string", label: "Roman numeral" }],
  title: "Decimal to Roman Converter",
});
export const runDecimalToRoman = decimalToRomanTool.execute;
export default decimalToRomanTool;
