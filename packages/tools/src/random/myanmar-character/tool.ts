// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMyanmarCharacterInput = Readonly<Record<string, never>>;
export type RandomMyanmarCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1000, 0x109f],
    [0xa92e, 0xa92e],
    [0xa9e0, 0xa9fe],
    [0xaa60, 0xaa7f],
    [0x116d0, 0x116e3],
  ],
} as const;

export const randomMyanmarCharacterValueCount = 244;

export const calculateRandomMyanmarCharacter = (
  random: RandomSource = Math.random,
): RandomMyanmarCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMyanmarCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomMyanmarCharacterInput,
  RandomMyanmarCharacterOutput
>;

export const randomMyanmarCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMyanmarCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Myanmar Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/myanmar-character",
  inputs: [],
  outputs: [
    {
      format: "random/myanmar-character",
      id: "value",
      kind: "string",
      label: "Random Myanmar Character",
    },
  ],
  title: "Random Myanmar Character Generator",
});

export const runRandomMyanmarCharacter = randomMyanmarCharacterTool.execute;
export default randomMyanmarCharacterTool;
