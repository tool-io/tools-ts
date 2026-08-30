// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMakasarCharacterInput = Readonly<Record<string, never>>;
export type RandomMakasarCharacterOutput = { readonly value: string };

const source = { ranges: [[0x11ee0, 0x11ef8]] } as const;

export const randomMakasarCharacterValueCount = 25;

export const calculateRandomMakasarCharacter = (
  random: RandomSource = Math.random,
): RandomMakasarCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMakasarCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomMakasarCharacterInput,
  RandomMakasarCharacterOutput
>;

export const randomMakasarCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMakasarCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Makasar Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/makasar-character",
  inputs: [],
  outputs: [
    {
      format: "random/makasar-character",
      id: "value",
      kind: "string",
      label: "Random Makasar Character",
    },
  ],
  title: "Random Makasar Character Generator",
});

export const runRandomMakasarCharacter = randomMakasarCharacterTool.execute;
export default randomMakasarCharacterTool;
