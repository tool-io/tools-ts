// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKiratRaiCharacterInput = Readonly<Record<string, never>>;
export type RandomKiratRaiCharacterOutput = { readonly value: string };

const source = { ranges: [[0x16d40, 0x16d79]] } as const;

export const randomKiratRaiCharacterValueCount = 58;

export const calculateRandomKiratRaiCharacter = (
  random: RandomSource = Math.random,
): RandomKiratRaiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKiratRaiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomKiratRaiCharacterInput,
  RandomKiratRaiCharacterOutput
>;

export const randomKiratRaiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKiratRaiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Kirat Rai Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/kirat-rai-character",
  inputs: [],
  outputs: [
    {
      format: "random/kirat-rai-character",
      id: "value",
      kind: "string",
      label: "Random Kirat Rai Character",
    },
  ],
  title: "Random Kirat Rai Character Generator",
});

export const runRandomKiratRaiCharacter = randomKiratRaiCharacterTool.execute;
export default randomKiratRaiCharacterTool;
