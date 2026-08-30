// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSinhalaCharacterInput = Readonly<Record<string, never>>;
export type RandomSinhalaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x964, 0x965],
    [0xd81, 0xd83],
    [0xd85, 0xd96],
    [0xd9a, 0xdb1],
    [0xdb3, 0xdbb],
    [0xdbd, 0xdbd],
    [0xdc0, 0xdc6],
    [0xdca, 0xdca],
    [0xdcf, 0xdd4],
    [0xdd6, 0xdd6],
    [0xdd8, 0xddf],
    [0xde6, 0xdef],
    [0xdf2, 0xdf4],
    [0x1cf2, 0x1cf2],
    [0x111e1, 0x111f4],
  ],
} as const;

export const randomSinhalaCharacterValueCount = 114;

export const calculateRandomSinhalaCharacter = (
  random: RandomSource = Math.random,
): RandomSinhalaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSinhalaCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomSinhalaCharacterInput,
  RandomSinhalaCharacterOutput
>;

export const randomSinhalaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSinhalaCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Sinhala Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/sinhala-character",
  inputs: [],
  outputs: [
    {
      format: "random/sinhala-character",
      id: "value",
      kind: "string",
      label: "Random Sinhala Character",
    },
  ],
  title: "Random Sinhala Character Generator",
});

export const runRandomSinhalaCharacter = randomSinhalaCharacterTool.execute;
export default randomSinhalaCharacterTool;
