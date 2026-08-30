// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomManichaeanCharacterInput = Readonly<Record<string, never>>;
export type RandomManichaeanCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x640, 0x640],
    [0x10ac0, 0x10ae6],
    [0x10aeb, 0x10af6],
  ],
} as const;

export const randomManichaeanCharacterValueCount = 52;

export const calculateRandomManichaeanCharacter = (
  random: RandomSource = Math.random,
): RandomManichaeanCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomManichaeanCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomManichaeanCharacterInput,
  RandomManichaeanCharacterOutput
>;

export const randomManichaeanCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomManichaeanCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Manichaean Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/manichaean-character",
  inputs: [],
  outputs: [
    {
      format: "random/manichaean-character",
      id: "value",
      kind: "string",
      label: "Random Manichaean Character",
    },
  ],
  title: "Random Manichaean Character Generator",
});

export const runRandomManichaeanCharacter =
  randomManichaeanCharacterTool.execute;
export default randomManichaeanCharacterTool;
