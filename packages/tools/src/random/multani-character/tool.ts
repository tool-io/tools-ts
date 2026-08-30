// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMultaniCharacterInput = Readonly<Record<string, never>>;
export type RandomMultaniCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xa66, 0xa6f],
    [0x11280, 0x11286],
    [0x11288, 0x11288],
    [0x1128a, 0x1128d],
    [0x1128f, 0x1129d],
    [0x1129f, 0x112a9],
  ],
} as const;

export const randomMultaniCharacterValueCount = 48;

export const calculateRandomMultaniCharacter = (
  random: RandomSource = Math.random,
): RandomMultaniCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMultaniCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomMultaniCharacterInput,
  RandomMultaniCharacterOutput
>;

export const randomMultaniCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMultaniCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Multani Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/multani-character",
  inputs: [],
  outputs: [
    {
      format: "random/multani-character",
      id: "value",
      kind: "string",
      label: "Random Multani Character",
    },
  ],
  title: "Random Multani Character Generator",
});

export const runRandomMultaniCharacter = randomMultaniCharacterTool.execute;
export default randomMultaniCharacterTool;
