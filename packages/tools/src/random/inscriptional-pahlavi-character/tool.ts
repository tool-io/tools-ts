// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomInscriptionalPahlaviCharacterInput = Readonly<
  Record<string, never>
>;
export type RandomInscriptionalPahlaviCharacterOutput = {
  readonly value: string;
};

const source = {
  ranges: [
    [0x10b60, 0x10b72],
    [0x10b78, 0x10b7f],
  ],
} as const;

export const randomInscriptionalPahlaviCharacterValueCount = 27;

export const calculateRandomInscriptionalPahlaviCharacter = (
  random: RandomSource = Math.random,
): RandomInscriptionalPahlaviCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomInscriptionalPahlaviCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomInscriptionalPahlaviCharacterInput,
  RandomInscriptionalPahlaviCharacterOutput
>;

export const randomInscriptionalPahlaviCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomInscriptionalPahlaviCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Inscriptional Pahlavi Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/inscriptional-pahlavi-character",
  inputs: [],
  outputs: [
    {
      format: "random/inscriptional-pahlavi-character",
      id: "value",
      kind: "string",
      label: "Random Inscriptional Pahlavi Character",
    },
  ],
  title: "Random Inscriptional Pahlavi Character Generator",
});

export const runRandomInscriptionalPahlaviCharacter =
  randomInscriptionalPahlaviCharacterTool.execute;
export default randomInscriptionalPahlaviCharacterTool;
