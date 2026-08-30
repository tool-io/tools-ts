// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomNewTaiLueCharacterInput = Readonly<Record<string, never>>;
export type RandomNewTaiLueCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1980, 0x19ab],
    [0x19b0, 0x19c9],
    [0x19d0, 0x19da],
    [0x19de, 0x19df],
  ],
} as const;

export const randomNewTaiLueCharacterValueCount = 83;

export const calculateRandomNewTaiLueCharacter = (
  random: RandomSource = Math.random,
): RandomNewTaiLueCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomNewTaiLueCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomNewTaiLueCharacterInput,
  RandomNewTaiLueCharacterOutput
>;

export const randomNewTaiLueCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomNewTaiLueCharacter(
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
    "Choose one assigned graphic Unicode 18.0 New Tai Lue Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/new-tai-lue-character",
  inputs: [],
  outputs: [
    {
      format: "random/new-tai-lue-character",
      id: "value",
      kind: "string",
      label: "Random New Tai Lue Character",
    },
  ],
  title: "Random New Tai Lue Character Generator",
});

export const runRandomNewTaiLueCharacter = randomNewTaiLueCharacterTool.execute;
export default randomNewTaiLueCharacterTool;
