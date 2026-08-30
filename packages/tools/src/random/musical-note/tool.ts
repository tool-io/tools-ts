// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMusicalNoteInput = Readonly<Record<string, never>>;
export type RandomMusicalNoteOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1d143, 0x1d15b],
    [0x1d15d, 0x1d164],
    [0x1d194, 0x1d195],
    [0x1d1bb, 0x1d1be],
    [0x1d1e0, 0x1d1e0],
    [0x1d1e2, 0x1d1e7],
    [0x1d267, 0x1d26a],
    [0x1f39c, 0x1f39d],
    [0x1f3b5, 0x1f3b6],
  ],
} as const;

export const randomMusicalNoteValueCount = 54;

export const calculateRandomMusicalNote = (
  random: RandomSource = Math.random,
): RandomMusicalNoteOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMusicalNoteExample = {
  input: {},
} satisfies ToolExample<RandomMusicalNoteInput, RandomMusicalNoteOutput>;

export const randomMusicalNoteTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMusicalNote(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Musical Note using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/musical-note",
  inputs: [],
  outputs: [
    {
      format: "random/musical-note",
      id: "value",
      kind: "string",
      label: "Random Musical Note",
    },
  ],
  title: "Random Musical Note Generator",
});

export const runRandomMusicalNote = randomMusicalNoteTool.execute;
export default randomMusicalNoteTool;
