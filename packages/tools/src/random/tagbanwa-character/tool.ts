// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTagbanwaCharacterInput = Readonly<Record<string, never>>;
export type RandomTagbanwaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1735, 0x1736],
    [0x1760, 0x176c],
    [0x176e, 0x1770],
    [0x1772, 0x1773],
  ],
} as const;

export const randomTagbanwaCharacterValueCount = 20;

export const calculateRandomTagbanwaCharacter = (
  random: RandomSource = Math.random,
): RandomTagbanwaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTagbanwaCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomTagbanwaCharacterInput,
  RandomTagbanwaCharacterOutput
>;

export const randomTagbanwaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTagbanwaCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Tagbanwa Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/tagbanwa-character",
  inputs: [],
  outputs: [
    {
      format: "random/tagbanwa-character",
      id: "value",
      kind: "string",
      label: "Random Tagbanwa Character",
    },
  ],
  title: "Random Tagbanwa Character Generator",
});

export const runRandomTagbanwaCharacter = randomTagbanwaCharacterTool.execute;
export default randomTagbanwaCharacterTool;
