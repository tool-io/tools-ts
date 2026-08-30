// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLepchaCharacterInput = Readonly<Record<string, never>>;
export type RandomLepchaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1c00, 0x1c37],
    [0x1c3b, 0x1c49],
    [0x1c4d, 0x1c4f],
  ],
} as const;

export const randomLepchaCharacterValueCount = 74;

export const calculateRandomLepchaCharacter = (
  random: RandomSource = Math.random,
): RandomLepchaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLepchaCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomLepchaCharacterInput,
  RandomLepchaCharacterOutput
>;

export const randomLepchaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLepchaCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Lepcha Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/lepcha-character",
  inputs: [],
  outputs: [
    {
      format: "random/lepcha-character",
      id: "value",
      kind: "string",
      label: "Random Lepcha Character",
    },
  ],
  title: "Random Lepcha Character Generator",
});

export const runRandomLepchaCharacter = randomLepchaCharacterTool.execute;
export default randomLepchaCharacterTool;
