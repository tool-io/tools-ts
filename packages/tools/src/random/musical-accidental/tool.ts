// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMusicalAccidentalInput = Readonly<Record<string, never>>;
export type RandomMusicalAccidentalOutput = { readonly value: string };

const source = {
  ranges: [
    [0x266d, 0x266f],
    [0x1d12a, 0x1d133],
    [0x1d1e8, 0x1d1f6],
    [0x1d256, 0x1d25a],
    [0x1d260, 0x1d260],
  ],
} as const;

export const randomMusicalAccidentalValueCount = 34;

export const calculateRandomMusicalAccidental = (
  random: RandomSource = Math.random,
): RandomMusicalAccidentalOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMusicalAccidentalExample = {
  input: {},
} satisfies ToolExample<
  RandomMusicalAccidentalInput,
  RandomMusicalAccidentalOutput
>;

export const randomMusicalAccidentalTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMusicalAccidental(
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
    "Choose one assigned graphic Unicode 18.0 Musical Accidental using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/musical-accidental",
  inputs: [],
  outputs: [
    {
      format: "random/musical-accidental",
      id: "value",
      kind: "string",
      label: "Random Musical Accidental",
    },
  ],
  title: "Random Musical Accidental Generator",
});

export const runRandomMusicalAccidental = randomMusicalAccidentalTool.execute;
export default randomMusicalAccidentalTool;
