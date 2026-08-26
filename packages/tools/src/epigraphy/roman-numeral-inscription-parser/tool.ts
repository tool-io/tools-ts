import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RomanNumeralInscriptionParserInput = {
  readonly numeral: string;
  readonly notation?: "classicalSubtractive" | "additive";
  readonly repetitionPolicy?: "maxThree" | "allowFour";
};

export type RomanNumeralInscriptionParserOutput = {
  readonly value: number;
  readonly symbolCount: number;
};

const SYMBOL_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};
const SUBTRACTIVE_PAIRS = new Set(["IV", "IX", "XL", "XC", "CD", "CM"]);
const REPEATABLE = new Set(["I", "X", "C", "M"]);

export const calculateRomanNumeralInscriptionParser = (
  input: RomanNumeralInscriptionParserInput,
): RomanNumeralInscriptionParserOutput => {
  const numeral = input.numeral.trim().toUpperCase();
  const notation = input.notation ?? "classicalSubtractive";
  const repetitionPolicy = input.repetitionPolicy ?? "allowFour";
  if (!numeral)
    return simpleError(
      "numeral",
      "Numeral text is required.",
      "invalid_numeral",
    );
  for (const ch of numeral)
    if (!(ch in SYMBOL_VALUES))
      return simpleError(
        "numeral",
        `Character '${ch}' is not a Roman numeral symbol (I V X L C D M).`,
        "invalid_numeral",
      );
  const counts: Record<string, number> = {};
  for (const ch of numeral) counts[ch] = (counts[ch] ?? 0) + 1;
  for (const sym of Object.keys(counts))
    if (!REPEATABLE.has(sym) && counts[sym] > 1)
      return simpleError(
        "numeral",
        `Symbol ${sym} must not be repeated.`,
        "invalid_repetition",
      );
  for (let start = 0; start < numeral.length;) {
    let end = start + 1;
    while (end < numeral.length && numeral[end] === numeral[start]) end += 1;
    const runLength = end - start;
    const maximum = repetitionPolicy === "maxThree" ? 3 : 4;
    if (REPEATABLE.has(numeral[start]) && runLength > maximum)
      return simpleError(
        "numeral",
        `Symbol ${numeral[start]} repeats ${runLength} times consecutively, exceeding the allowed maximum.`,
        "invalid_repetition",
      );
    start = end;
  }
  if (notation === "classicalSubtractive")
    for (let i = 0; i < numeral.length - 1; i += 1) {
      if (SYMBOL_VALUES[numeral[i]] < SYMBOL_VALUES[numeral[i + 1]]) {
        const pair = numeral.slice(i, i + 2);
        if (!SUBTRACTIVE_PAIRS.has(pair))
          return simpleError(
            "numeral",
            `Pair ${pair} is not an allowed subtractive combination.`,
            "invalid_subtraction",
          );
        if (i > 0 && numeral[i - 1] === numeral[i])
          return simpleError(
            "numeral",
            `Subtractor ${numeral[i]} must not be repeated before ${numeral[i + 1]}.`,
            "invalid_subtraction",
          );
      }
    }
  if (notation === "classicalSubtractive") {
    let previousTokenValue = Number.POSITIVE_INFINITY;
    for (let i = 0; i < numeral.length; i += 1) {
      const current = SYMBOL_VALUES[numeral[i]];
      const next = i + 1 < numeral.length ? SYMBOL_VALUES[numeral[i + 1]] : 0;
      const tokenValue = current < next ? next - current : current;
      if (tokenValue > previousTokenValue)
        return simpleError(
          "numeral",
          `Numeral token at position ${i} is out of descending value order.`,
          "invalid_order",
        );
      previousTokenValue = tokenValue;
      if (current < next) i += 1;
    }
  }
  let value = 0;
  for (let i = 0; i < numeral.length; i += 1) {
    const cur = SYMBOL_VALUES[numeral[i]];
    const next = i + 1 < numeral.length ? SYMBOL_VALUES[numeral[i + 1]] : 0;
    value += notation === "classicalSubtractive" && cur < next ? -cur : cur;
  }
  return { value, symbolCount: numeral.length };
};

export const romanNumeralInscriptionParserExample = {
  input: { numeral: "MDCCLXXVI" },
  output: { value: 1776, symbolCount: 9 },
} satisfies ToolExample<
  RomanNumeralInscriptionParserInput,
  RomanNumeralInscriptionParserOutput
>;

export const romanNumeralInscriptionParserTool = createSimpleTool({
  id: "epigraphy/roman-numeral-inscription-parser",
  title: "Roman Numeral Inscription Value Parser Validator",
  description:
    "Parse a Latin inscription numeral (characters I V X L C D M, case- and whitespace-tolerant) into its numeric value under the classical subtractive or pure additive convention, with epigraphic fourfold repetition (IIII) allowed by default.",
  inputs: [
    {
      description: "Roman numeral text.",
      id: "numeral",
      kind: "string",
      label: "Numeral",
    },
    {
      default: "classicalSubtractive",
      description:
        "Reading convention: classical subtractive pairs or purely additive sums.",
      enum: ["classicalSubtractive", "additive"],
      id: "notation",
      kind: "string",
      label: "Notation",
    },
    {
      default: "allowFour",
      description:
        "Repetition ceiling: epigraphic fourfold runs (IIII) or strict threefold maximum.",
      enum: ["allowFour", "maxThree"],
      id: "repetitionPolicy",
      kind: "string",
      label: "Repetition policy",
    },
  ],
  outputs: [
    {
      description: "Numeric value of the numeral.",
      id: "value",
      kind: "integer",
      label: "Value",
    },
    {
      description: "Number of numeral characters parsed.",
      id: "symbolCount",
      kind: "integer",
      label: "Symbol count",
    },
  ],
  calculate: (input) =>
    calculateRomanNumeralInscriptionParser(
      input as unknown as RomanNumeralInscriptionParserInput,
    ),
});

export const runRomanNumeralInscriptionParser =
  romanNumeralInscriptionParserTool.execute;
export default romanNumeralInscriptionParserTool;
