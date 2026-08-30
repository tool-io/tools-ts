// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomUnicodePrivateUseCharacterInput = Readonly<Record<string, never>>;
export type RandomUnicodePrivateUseCharacterOutput = { readonly value: string };

const source = { ranges: [[0xe000, 0xf8ff], [0xf0000, 0xffffd], [0x100000, 0x10fffd]] } as const;

export const randomUnicodePrivateUseCharacterValueCount = 137468;

export const calculateRandomUnicodePrivateUseCharacter = (
  random: RandomSource = Math.random,
): RandomUnicodePrivateUseCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomUnicodePrivateUseCharacterExample = { input: {} } satisfies ToolExample<
  RandomUnicodePrivateUseCharacterInput,
  RandomUnicodePrivateUseCharacterOutput
>;

export const randomUnicodePrivateUseCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomUnicodePrivateUseCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode private-use code point from the BMP or supplementary private-use planes using injected randomness; no public meaning is assigned.",
  id: "random/unicode-private-use-character",
  inputs: [],
  outputs: [
    {
      format: "random/unicode-private-use-character",
      id: "value",
      kind: "string",
      label: "Random Unicode Private-Use Character",
    },
  ],
  title: "Random Unicode Private-Use Character Generator",
});

export const runRandomUnicodePrivateUseCharacter = randomUnicodePrivateUseCharacterTool.execute;
export default randomUnicodePrivateUseCharacterTool;
