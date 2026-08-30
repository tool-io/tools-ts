// Repertoire source: an explicitly scoped tool.io repertoire
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomJapaneseSignSyllableInput = Readonly<Record<string, never>>;
export type RandomJapaneseSignSyllableOutput = { readonly value: string };

const source = {
  values: [
    "あ",
    "い",
    "う",
    "え",
    "お",
    "か",
    "き",
    "く",
    "け",
    "こ",
    "さ",
    "し",
    "す",
    "せ",
    "そ",
    "た",
    "ち",
    "つ",
    "て",
    "と",
    "な",
    "に",
    "ぬ",
    "ね",
    "の",
    "は",
    "ひ",
    "ふ",
    "へ",
    "ほ",
    "ま",
    "み",
    "む",
    "め",
    "も",
    "や",
    "ゆ",
    "よ",
    "ら",
    "り",
    "る",
    "れ",
    "ろ",
    "わ",
    "を",
    "ん",
  ],
} as const;

export const randomJapaneseSignSyllableValueCount = 46;

export const calculateRandomJapaneseSignSyllable = (
  random: RandomSource = Math.random,
): RandomJapaneseSignSyllableOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomJapaneseSignSyllableExample = {
  input: {},
} satisfies ToolExample<
  RandomJapaneseSignSyllableInput,
  RandomJapaneseSignSyllableOutput
>;

export const randomJapaneseSignSyllableTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomJapaneseSignSyllable(
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
    "Choose one Japanese Sign Language syllable prompt using injected randomness; the portable result identifies the kana and does not render a handshape.",
  id: "random/japanese-sign-syllable",
  inputs: [],
  outputs: [
    {
      format: "random/japanese-sign-syllable",
      id: "value",
      kind: "string",
      label: "Random Japanese Sign Syllable",
    },
  ],
  title: "Random Japanese Sign Syllable Generator",
});

export const runRandomJapaneseSignSyllable =
  randomJapaneseSignSyllableTool.execute;
export default randomJapaneseSignSyllableTool;
