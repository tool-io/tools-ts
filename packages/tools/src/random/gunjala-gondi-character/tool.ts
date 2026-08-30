// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGunjalaGondiCharacterInput = Readonly<Record<string, never>>;
export type RandomGunjalaGondiCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0xb7, 0xb7],
    [0x964, 0x965],
    [0x11d60, 0x11d65],
    [0x11d67, 0x11d68],
    [0x11d6a, 0x11d8e],
    [0x11d90, 0x11d91],
    [0x11d93, 0x11d98],
    [0x11da0, 0x11da9],
  ],
} as const;

export const randomGunjalaGondiCharacterValueCount = 66;

export const calculateRandomGunjalaGondiCharacter = (
  random: RandomSource = Math.random,
): RandomGunjalaGondiCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGunjalaGondiCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomGunjalaGondiCharacterInput,
  RandomGunjalaGondiCharacterOutput
>;

export const randomGunjalaGondiCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGunjalaGondiCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Gunjala Gondi Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/gunjala-gondi-character",
  inputs: [],
  outputs: [
    {
      format: "random/gunjala-gondi-character",
      id: "value",
      kind: "string",
      label: "Random Gunjala Gondi Character",
    },
  ],
  title: "Random Gunjala Gondi Character Generator",
});

export const runRandomGunjalaGondiCharacter =
  randomGunjalaGondiCharacterTool.execute;
export default randomGunjalaGondiCharacterTool;
