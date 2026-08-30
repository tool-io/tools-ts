// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKhitanSmallScriptCharacterInput = Readonly<
  Record<string, never>
>;
export type RandomKhitanSmallScriptCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x16fe4, 0x16fe4],
    [0x18b00, 0x18cda],
    [0x18cff, 0x18cff],
  ],
} as const;

export const randomKhitanSmallScriptCharacterValueCount = 477;

export const calculateRandomKhitanSmallScriptCharacter = (
  random: RandomSource = Math.random,
): RandomKhitanSmallScriptCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKhitanSmallScriptCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomKhitanSmallScriptCharacterInput,
  RandomKhitanSmallScriptCharacterOutput
>;

export const randomKhitanSmallScriptCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKhitanSmallScriptCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Khitan Small Script Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/khitan-small-script-character",
  inputs: [],
  outputs: [
    {
      format: "random/khitan-small-script-character",
      id: "value",
      kind: "string",
      label: "Random Khitan Small Script Character",
    },
  ],
  title: "Random Khitan Small Script Character Generator",
});

export const runRandomKhitanSmallScriptCharacter =
  randomKhitanSmallScriptCharacterTool.execute;
export default randomKhitanSmallScriptCharacterTool;
