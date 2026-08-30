// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomDivesAkuruCharacterInput = Readonly<Record<string, never>>;
export type RandomDivesAkuruCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x11900, 0x11906],
    [0x11909, 0x11909],
    [0x1190c, 0x11913],
    [0x11915, 0x11916],
    [0x11918, 0x11935],
    [0x11937, 0x11938],
    [0x1193b, 0x11946],
    [0x11950, 0x11959],
  ],
} as const;

export const randomDivesAkuruCharacterValueCount = 72;

export const calculateRandomDivesAkuruCharacter = (
  random: RandomSource = Math.random,
): RandomDivesAkuruCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomDivesAkuruCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomDivesAkuruCharacterInput,
  RandomDivesAkuruCharacterOutput
>;

export const randomDivesAkuruCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomDivesAkuruCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Dives Akuru Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/dives-akuru-character",
  inputs: [],
  outputs: [
    {
      format: "random/dives-akuru-character",
      id: "value",
      kind: "string",
      label: "Random Dives Akuru Character",
    },
  ],
  title: "Random Dives Akuru Character Generator",
});

export const runRandomDivesAkuruCharacter =
  randomDivesAkuruCharacterTool.execute;
export default randomDivesAkuruCharacterTool;
