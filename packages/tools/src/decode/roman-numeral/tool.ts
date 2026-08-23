import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RomanNumeralInput = {
  readonly roman: string;
};

export type RomanNumeralOutput = {
  readonly value: number;
};

export const calculateRomanNumeral = (
  input: RomanNumeralInput,
): RomanNumeralOutput => {
  if (
    !/^(?=[MDCLXVI])M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(
      input.roman,
    )
  )
    return simpleError(
      "roman",
      "Provide a valid Roman numeral in standard subtractive notation (I to MMMCMXCIX).",
      "invalid_roman_numeral",
    );
  const values: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let total = 0;
  for (let index = 0; index < input.roman.length; index += 1) {
    const current = values[input.roman[index]!]!;
    const next =
      index + 1 < input.roman.length ? values[input.roman[index + 1]!]! : 0;
    total += current < next ? -current : current;
  }
  return { value: total };
};

export const romanNumeralExample = {
  input: {
    roman: "MCMXCIV",
  },
  output: {
    value: 1994,
  },
} satisfies ToolExample<RomanNumeralInput, RomanNumeralOutput>;

export const romanNumeralTool = createSimpleTool({
  id: "decode/roman-numeral",
  title: "Roman Numeral Decoder",
  description:
    "Decode a canonical subtractive Roman numeral between I and MMMCMXCIX into its integer value.",
  inputs: [
    {
      description:
        "Canonical Roman numeral using standard subtractive notation, e.g. MCMXCIV.",
      id: "roman",
      kind: "string",
      label: "Roman numeral",
    },
  ],
  outputs: [
    {
      description: "Decoded integer value from 1 to 3999.",
      id: "value",
      kind: "integer",
      label: "Value",
    },
  ],
  calculate: (input) => calculateRomanNumeral({ roman: input.roman as string }),
});

export const runRomanNumeral = romanNumeralTool.execute;
export default romanNumeralTool;
