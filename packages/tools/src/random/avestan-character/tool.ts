// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAvestanCharacterInput = Readonly<Record<string, never>>;
export type RandomAvestanCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xb7, 0xb7],
    [0x2e30, 0x2e31],
    [0x10b00, 0x10b35],
    [0x10b39, 0x10b3f],
  ],
} as const;

export const randomAvestanCharacterValueCount = 64;

export const calculateRandomAvestanCharacter = (
  random: RandomSource = Math.random,
): RandomAvestanCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAvestanCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomAvestanCharacterInput,
  RandomAvestanCharacterOutput
>;

export const randomAvestanCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAvestanCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Avestan Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/avestan-character",
  inputs: [],
  outputs: [
    {
      format: "random/avestan-character",
      id: "value",
      kind: "string",
      label: "Random Avestan Character",
    },
  ],
  title: "Random Avestan Character Generator",
});

export const runRandomAvestanCharacter = randomAvestanCharacterTool.execute;
export default randomAvestanCharacterTool;
