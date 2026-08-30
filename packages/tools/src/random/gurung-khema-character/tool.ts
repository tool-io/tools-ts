// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGurungKhemaCharacterInput = Readonly<Record<string, never>>;
export type RandomGurungKhemaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x965, 0x965],
    [0x16100, 0x16139],
  ],
} as const;

export const randomGurungKhemaCharacterValueCount = 59;

export const calculateRandomGurungKhemaCharacter = (
  random: RandomSource = Math.random,
): RandomGurungKhemaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGurungKhemaCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomGurungKhemaCharacterInput,
  RandomGurungKhemaCharacterOutput
>;

export const randomGurungKhemaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGurungKhemaCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Gurung Khema Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/gurung-khema-character",
  inputs: [],
  outputs: [
    {
      format: "random/gurung-khema-character",
      id: "value",
      kind: "string",
      label: "Random Gurung Khema Character",
    },
  ],
  title: "Random Gurung Khema Character Generator",
});

export const runRandomGurungKhemaCharacter =
  randomGurungKhemaCharacterTool.execute;
export default randomGurungKhemaCharacterTool;
