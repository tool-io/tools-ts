// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomInscriptionalParthianCharacterInput = Readonly<
  Record<string, never>
>;
export type RandomInscriptionalParthianCharacterOutput = {
  readonly value: string;
};

const source = {
  ranges: [
    [0x10b40, 0x10b55],
    [0x10b58, 0x10b5f],
  ],
} as const;

export const randomInscriptionalParthianCharacterValueCount = 30;

export const calculateRandomInscriptionalParthianCharacter = (
  random: RandomSource = Math.random,
): RandomInscriptionalParthianCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomInscriptionalParthianCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomInscriptionalParthianCharacterInput,
  RandomInscriptionalParthianCharacterOutput
>;

export const randomInscriptionalParthianCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomInscriptionalParthianCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Inscriptional Parthian Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/inscriptional-parthian-character",
  inputs: [],
  outputs: [
    {
      format: "random/inscriptional-parthian-character",
      id: "value",
      kind: "string",
      label: "Random Inscriptional Parthian Character",
    },
  ],
  title: "Random Inscriptional Parthian Character Generator",
});

export const runRandomInscriptionalParthianCharacter =
  randomInscriptionalParthianCharacterTool.execute;
export default randomInscriptionalParthianCharacterTool;
