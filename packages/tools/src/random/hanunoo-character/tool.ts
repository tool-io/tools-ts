// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomHanunooCharacterInput = Readonly<Record<string, never>>;
export type RandomHanunooCharacterOutput = { readonly value: string };

const source = { ranges: [[0x1720, 0x1736]] } as const;

export const randomHanunooCharacterValueCount = 23;

export const calculateRandomHanunooCharacter = (
  random: RandomSource = Math.random,
): RandomHanunooCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomHanunooCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomHanunooCharacterInput,
  RandomHanunooCharacterOutput
>;

export const randomHanunooCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomHanunooCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Hanunoo Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/hanunoo-character",
  inputs: [],
  outputs: [
    {
      format: "random/hanunoo-character",
      id: "value",
      kind: "string",
      label: "Random Hanunoo Character",
    },
  ],
  title: "Random Hanunoo Character Generator",
});

export const runRandomHanunooCharacter = randomHanunooCharacterTool.execute;
export default randomHanunooCharacterTool;
