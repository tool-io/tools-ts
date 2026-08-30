// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOsmanyaCharacterInput = Readonly<Record<string, never>>;
export type RandomOsmanyaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x10480, 0x1049d],
    [0x104a0, 0x104a9],
  ],
} as const;

export const randomOsmanyaCharacterValueCount = 40;

export const calculateRandomOsmanyaCharacter = (
  random: RandomSource = Math.random,
): RandomOsmanyaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOsmanyaCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomOsmanyaCharacterInput,
  RandomOsmanyaCharacterOutput
>;

export const randomOsmanyaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOsmanyaCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Osmanya Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/osmanya-character",
  inputs: [],
  outputs: [
    {
      format: "random/osmanya-character",
      id: "value",
      kind: "string",
      label: "Random Osmanya Character",
    },
  ],
  title: "Random Osmanya Character Generator",
});

export const runRandomOsmanyaCharacter = randomOsmanyaCharacterTool.execute;
export default randomOsmanyaCharacterTool;
