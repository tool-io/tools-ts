// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKannadaCharacterInput = Readonly<Record<string, never>>;
export type RandomKannadaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x951, 0x952],
    [0x964, 0x965],
    [0xb83, 0xb83],
    [0xc80, 0xc8c],
    [0xc8e, 0xc90],
    [0xc92, 0xca8],
    [0xcaa, 0xcb3],
    [0xcb5, 0xcb9],
    [0xcbc, 0xcc4],
    [0xcc6, 0xcc8],
    [0xcca, 0xccd],
    [0xcd5, 0xcd6],
    [0xcdc, 0xcde],
    [0xce0, 0xce3],
    [0xce6, 0xcef],
    [0xcf1, 0xcf3],
    [0x1cd0, 0x1cd0],
    [0x1cd2, 0x1cd3],
    [0x1cda, 0x1cda],
    [0x1cf2, 0x1cf2],
    [0x1cf4, 0x1cf4],
    [0xa830, 0xa835],
  ],
} as const;

export const randomKannadaCharacterValueCount = 109;

export const calculateRandomKannadaCharacter = (
  random: RandomSource = Math.random,
): RandomKannadaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKannadaCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomKannadaCharacterInput,
  RandomKannadaCharacterOutput
>;

export const randomKannadaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKannadaCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Kannada Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/kannada-character",
  inputs: [],
  outputs: [
    {
      format: "random/kannada-character",
      id: "value",
      kind: "string",
      label: "Random Kannada Character",
    },
  ],
  title: "Random Kannada Character Generator",
});

export const runRandomKannadaCharacter = randomKannadaCharacterTool.execute;
export default randomKannadaCharacterTool;
