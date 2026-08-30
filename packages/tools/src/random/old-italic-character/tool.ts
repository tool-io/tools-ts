// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOldItalicCharacterInput = Readonly<Record<string, never>>;
export type RandomOldItalicCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x10300, 0x10323],
    [0x1032d, 0x1032f],
  ],
} as const;

export const randomOldItalicCharacterValueCount = 39;

export const calculateRandomOldItalicCharacter = (
  random: RandomSource = Math.random,
): RandomOldItalicCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOldItalicCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomOldItalicCharacterInput,
  RandomOldItalicCharacterOutput
>;

export const randomOldItalicCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOldItalicCharacter(
      context.random ?? Math.random,
    );
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Old Italic Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/old-italic-character",
  inputs: [],
  outputs: [
    {
      format: "random/old-italic-character",
      id: "value",
      kind: "string",
      label: "Random Old Italic Character",
    },
  ],
  title: "Random Old Italic Character Generator",
});

export const runRandomOldItalicCharacter = randomOldItalicCharacterTool.execute;
export default randomOldItalicCharacterTool;
