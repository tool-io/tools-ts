// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAdlamCharacterInput = Readonly<Record<string, never>>;
export type RandomAdlamCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x61f, 0x61f],
    [0x640, 0x640],
    [0x204f, 0x204f],
    [0x2e41, 0x2e41],
    [0x1e900, 0x1e94b],
    [0x1e950, 0x1e959],
    [0x1e95e, 0x1e95f],
  ],
} as const;

export const randomAdlamCharacterValueCount = 92;

export const calculateRandomAdlamCharacter = (
  random: RandomSource = Math.random,
): RandomAdlamCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAdlamCharacterExample = {
  input: {},
} satisfies ToolExample<RandomAdlamCharacterInput, RandomAdlamCharacterOutput>;

export const randomAdlamCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAdlamCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Adlam Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/adlam-character",
  inputs: [],
  outputs: [
    {
      format: "random/adlam-character",
      id: "value",
      kind: "string",
      label: "Random Adlam Character",
    },
  ],
  title: "Random Adlam Character Generator",
});

export const runRandomAdlamCharacter = randomAdlamCharacterTool.execute;
export default randomAdlamCharacterTool;
