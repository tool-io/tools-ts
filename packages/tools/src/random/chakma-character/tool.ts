// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomChakmaCharacterInput = Readonly<Record<string, never>>;
export type RandomChakmaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x9e6, 0x9ef],
    [0x1040, 0x1049],
    [0x11100, 0x11134],
    [0x11136, 0x11147],
  ],
} as const;

export const randomChakmaCharacterValueCount = 91;

export const calculateRandomChakmaCharacter = (
  random: RandomSource = Math.random,
): RandomChakmaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomChakmaCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomChakmaCharacterInput,
  RandomChakmaCharacterOutput
>;

export const randomChakmaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomChakmaCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Chakma Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/chakma-character",
  inputs: [],
  outputs: [
    {
      format: "random/chakma-character",
      id: "value",
      kind: "string",
      label: "Random Chakma Character",
    },
  ],
  title: "Random Chakma Character Generator",
});

export const runRandomChakmaCharacter = randomChakmaCharacterTool.execute;
export default randomChakmaCharacterTool;
