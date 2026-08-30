// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMusicalClefInput = Readonly<Record<string, never>>;
export type RandomMusicalClefOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1d11e, 0x1d126],
    [0x1d1d0, 0x1d1d1],
    [0x1d1de, 0x1d1de],
    [0x1d275, 0x1d27e],
  ],
} as const;

export const randomMusicalClefValueCount = 22;

export const calculateRandomMusicalClef = (
  random: RandomSource = Math.random,
): RandomMusicalClefOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMusicalClefExample = {
  input: {},
} satisfies ToolExample<RandomMusicalClefInput, RandomMusicalClefOutput>;

export const randomMusicalClefTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMusicalClef(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Musical Clef using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/musical-clef",
  inputs: [],
  outputs: [
    {
      format: "random/musical-clef",
      id: "value",
      kind: "string",
      label: "Random Musical Clef",
    },
  ],
  title: "Random Musical Clef Generator",
});

export const runRandomMusicalClef = randomMusicalClefTool.execute;
export default randomMusicalClefTool;
