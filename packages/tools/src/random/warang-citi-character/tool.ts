// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomWarangCitiCharacterInput = Readonly<Record<string, never>>;
export type RandomWarangCitiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x118a0, 0x118f2],
    [0x118ff, 0x118ff],
  ],
} as const;

export const randomWarangCitiCharacterValueCount = 84;

export const calculateRandomWarangCitiCharacter = (
  random: RandomSource = Math.random,
): RandomWarangCitiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomWarangCitiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomWarangCitiCharacterInput,
  RandomWarangCitiCharacterOutput
>;

export const randomWarangCitiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomWarangCitiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Warang Citi Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/warang-citi-character",
  inputs: [],
  outputs: [
    {
      format: "random/warang-citi-character",
      id: "value",
      kind: "string",
      label: "Random Warang Citi Character",
    },
  ],
  title: "Random Warang Citi Character Generator",
});

export const runRandomWarangCitiCharacter =
  randomWarangCitiCharacterTool.execute;
export default randomWarangCitiCharacterTool;
