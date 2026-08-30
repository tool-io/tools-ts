// Repertoire source: https://www.unicode.org/charts/PDF/U3040.pdf
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomHiraganaDigraphInput = Readonly<Record<string, never>>;
export type RandomHiraganaDigraphOutput = { readonly value: string };

const source = { values: ["きゃ", "きゅ", "きょ", "しゃ", "しゅ", "しょ", "ちゃ", "ちゅ", "ちょ", "にゃ", "にゅ", "にょ", "ひゃ", "ひゅ", "ひょ", "みゃ", "みゅ", "みょ", "りゃ", "りゅ", "りょ", "ぎゃ", "ぎゅ", "ぎょ", "じゃ", "じゅ", "じょ", "びゃ", "びゅ", "びょ", "ぴゃ", "ぴゅ", "ぴょ"] } as const;

export const randomHiraganaDigraphValueCount = 33;

export const calculateRandomHiraganaDigraph = (
  random: RandomSource = Math.random,
): RandomHiraganaDigraphOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomHiraganaDigraphExample = { input: {} } satisfies ToolExample<
  RandomHiraganaDigraphInput,
  RandomHiraganaDigraphOutput
>;

export const randomHiraganaDigraphTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomHiraganaDigraph(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one traditional modern Japanese Hiragana yōon digraph made from an i-row kana and small ya, yu, or yo using injected randomness.",
  id: "random/hiragana-digraph",
  inputs: [],
  outputs: [
    {
      format: "random/hiragana-digraph",
      id: "value",
      kind: "string",
      label: "Random Hiragana Digraph",
    },
  ],
  title: "Random Hiragana Digraph Generator",
});

export const runRandomHiraganaDigraph = randomHiraganaDigraphTool.execute;
export default randomHiraganaDigraphTool;
