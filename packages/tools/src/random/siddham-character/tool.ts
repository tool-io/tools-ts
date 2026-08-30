// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSiddhamCharacterInput = Readonly<Record<string, never>>;
export type RandomSiddhamCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x11580, 0x115b5],
    [0x115b8, 0x115dd],
  ],
} as const;

export const randomSiddhamCharacterValueCount = 92;

export const calculateRandomSiddhamCharacter = (
  random: RandomSource = Math.random,
): RandomSiddhamCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSiddhamCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomSiddhamCharacterInput,
  RandomSiddhamCharacterOutput
>;

export const randomSiddhamCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSiddhamCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Siddham Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/siddham-character",
  inputs: [],
  outputs: [
    {
      format: "random/siddham-character",
      id: "value",
      kind: "string",
      label: "Random Siddham Character",
    },
  ],
  title: "Random Siddham Character Generator",
});

export const runRandomSiddhamCharacter = randomSiddhamCharacterTool.execute;
export default randomSiddhamCharacterTool;
