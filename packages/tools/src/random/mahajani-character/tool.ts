// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMahajaniCharacterInput = Readonly<Record<string, never>>;
export type RandomMahajaniCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xb7, 0xb7],
    [0x964, 0x96f],
    [0xa830, 0xa839],
    [0x11150, 0x11176],
  ],
} as const;

export const randomMahajaniCharacterValueCount = 62;

export const calculateRandomMahajaniCharacter = (
  random: RandomSource = Math.random,
): RandomMahajaniCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMahajaniCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomMahajaniCharacterInput,
  RandomMahajaniCharacterOutput
>;

export const randomMahajaniCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMahajaniCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Mahajani Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/mahajani-character",
  inputs: [],
  outputs: [
    {
      format: "random/mahajani-character",
      id: "value",
      kind: "string",
      label: "Random Mahajani Character",
    },
  ],
  title: "Random Mahajani Character Generator",
});

export const runRandomMahajaniCharacter = randomMahajaniCharacterTool.execute;
export default randomMahajaniCharacterTool;
