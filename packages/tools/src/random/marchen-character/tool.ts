// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMarchenCharacterInput = Readonly<Record<string, never>>;
export type RandomMarchenCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x11c70, 0x11c8f],
    [0x11c92, 0x11ca7],
    [0x11ca9, 0x11cb6],
  ],
} as const;

export const randomMarchenCharacterValueCount = 68;

export const calculateRandomMarchenCharacter = (
  random: RandomSource = Math.random,
): RandomMarchenCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMarchenCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomMarchenCharacterInput,
  RandomMarchenCharacterOutput
>;

export const randomMarchenCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMarchenCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Marchen Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/marchen-character",
  inputs: [],
  outputs: [
    {
      format: "random/marchen-character",
      id: "value",
      kind: "string",
      label: "Random Marchen Character",
    },
  ],
  title: "Random Marchen Character Generator",
});

export const runRandomMarchenCharacter = randomMarchenCharacterTool.execute;
export default randomMarchenCharacterTool;
