// Repertoire source: https://www.rfc-editor.org/rfc/rfc20
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAsciiPunctuationCharacterInput = Readonly<Record<string, never>>;
export type RandomAsciiPunctuationCharacterOutput = { readonly value: string };

const source = { ranges: [[0x21, 0x2f], [0x3a, 0x40], [0x5b, 0x60], [0x7b, 0x7e]] } as const;

export const randomAsciiPunctuationCharacterValueCount = 32;

export const calculateRandomAsciiPunctuationCharacter = (
  random: RandomSource = Math.random,
): RandomAsciiPunctuationCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAsciiPunctuationCharacterExample = { input: {} } satisfies ToolExample<
  RandomAsciiPunctuationCharacterInput,
  RandomAsciiPunctuationCharacterOutput
>;

export const randomAsciiPunctuationCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAsciiPunctuationCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one of the 32 ASCII punctuation or symbol characters using injected randomness.",
  id: "random/ascii-punctuation-character",
  inputs: [],
  outputs: [
    {
      format: "random/ascii-punctuation-character",
      id: "value",
      kind: "string",
      label: "Random ASCII Punctuation Character",
    },
  ],
  title: "Random ASCII Punctuation Character Generator",
});

export const runRandomAsciiPunctuationCharacter = randomAsciiPunctuationCharacterTool.execute;
export default randomAsciiPunctuationCharacterTool;
