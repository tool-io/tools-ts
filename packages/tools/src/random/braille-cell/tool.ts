// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBrailleCellInput = Readonly<Record<string, never>>;
export type RandomBrailleCellOutput = { readonly value: string };

const source = { ranges: [[0x2800, 0x28ff]] } as const;

export const randomBrailleCellValueCount = 256;

export const calculateRandomBrailleCell = (
  random: RandomSource = Math.random,
): RandomBrailleCellOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBrailleCellExample = {
  input: {},
} satisfies ToolExample<RandomBrailleCellInput, RandomBrailleCellOutput>;

export const randomBrailleCellTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBrailleCell(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Braille Cell using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/braille-cell",
  inputs: [],
  outputs: [
    {
      format: "random/braille-cell",
      id: "value",
      kind: "string",
      label: "Random Braille Cell",
    },
  ],
  title: "Random Braille Cell Generator",
});

export const runRandomBrailleCell = randomBrailleCellTool.execute;
export default randomBrailleCellTool;
