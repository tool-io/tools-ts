// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSylotiNagriCharacterInput = Readonly<Record<string, never>>;
export type RandomSylotiNagriCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x964, 0x965],
    [0x9e6, 0x9ef],
    [0xa800, 0xa82c],
  ],
} as const;

export const randomSylotiNagriCharacterValueCount = 57;

export const calculateRandomSylotiNagriCharacter = (
  random: RandomSource = Math.random,
): RandomSylotiNagriCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSylotiNagriCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomSylotiNagriCharacterInput,
  RandomSylotiNagriCharacterOutput
>;

export const randomSylotiNagriCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSylotiNagriCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Syloti Nagri Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/syloti-nagri-character",
  inputs: [],
  outputs: [
    {
      format: "random/syloti-nagri-character",
      id: "value",
      kind: "string",
      label: "Random Syloti Nagri Character",
    },
  ],
  title: "Random Syloti Nagri Character Generator",
});

export const runRandomSylotiNagriCharacter =
  randomSylotiNagriCharacterTool.execute;
export default randomSylotiNagriCharacterTool;
