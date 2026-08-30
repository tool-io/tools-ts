// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomHangulCharacterInput = Readonly<Record<string, never>>;
export type RandomHangulCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1100, 0x11ff],
    [0x3001, 0x3003],
    [0x3008, 0x3011],
    [0x3013, 0x301f],
    [0x302e, 0x3030],
    [0x3037, 0x3037],
    [0x30fb, 0x30fb],
    [0x3131, 0x318e],
    [0x3200, 0x321e],
    [0x3260, 0x327e],
    [0xa960, 0xa97c],
    [0xac00, 0xd7a3],
    [0xd7b0, 0xd7c6],
    [0xd7cb, 0xd7fb],
    [0xfe45, 0xfe46],
    [0xff61, 0xff65],
    [0xffa0, 0xffbe],
    [0xffc2, 0xffc7],
    [0xffca, 0xffcf],
    [0xffd2, 0xffd7],
    [0xffda, 0xffdc],
  ],
} as const;

export const randomHangulCharacterValueCount = 11775;

export const calculateRandomHangulCharacter = (
  random: RandomSource = Math.random,
): RandomHangulCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomHangulCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomHangulCharacterInput,
  RandomHangulCharacterOutput
>;

export const randomHangulCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomHangulCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Hangul Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/hangul-character",
  inputs: [],
  outputs: [
    {
      format: "random/hangul-character",
      id: "value",
      kind: "string",
      label: "Random Hangul Character",
    },
  ],
  title: "Random Hangul Character Generator",
});

export const runRandomHangulCharacter = randomHangulCharacterTool.execute;
export default randomHangulCharacterTool;
