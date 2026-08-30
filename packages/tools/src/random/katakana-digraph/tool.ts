// Repertoire source: https://www.unicode.org/charts/PDF/U30A0.pdf
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomKatakanaDigraphInput = Readonly<Record<string, never>>;
export type RandomKatakanaDigraphOutput = { readonly value: string };

const source = { values: ["キャ", "キュ", "キョ", "シャ", "シュ", "ショ", "チャ", "チュ", "チョ", "ニャ", "ニュ", "ニョ", "ヒャ", "ヒュ", "ヒョ", "ミャ", "ミュ", "ミョ", "リャ", "リュ", "リョ", "ギャ", "ギュ", "ギョ", "ジャ", "ジュ", "ジョ", "ビャ", "ビュ", "ビョ", "ピャ", "ピュ", "ピョ"] } as const;

export const randomKatakanaDigraphValueCount = 33;

export const calculateRandomKatakanaDigraph = (
  random: RandomSource = Math.random,
): RandomKatakanaDigraphOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomKatakanaDigraphExample = { input: {} } satisfies ToolExample<
  RandomKatakanaDigraphInput,
  RandomKatakanaDigraphOutput
>;

export const randomKatakanaDigraphTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomKatakanaDigraph(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one traditional modern Japanese Katakana yōon digraph made from an i-row kana and small ya, yu, or yo using injected randomness.",
  id: "random/katakana-digraph",
  inputs: [],
  outputs: [
    {
      format: "random/katakana-digraph",
      id: "value",
      kind: "string",
      label: "Random Katakana Digraph",
    },
  ],
  title: "Random Katakana Digraph Generator",
});

export const runRandomKatakanaDigraph = randomKatakanaDigraphTool.execute;
export default randomKatakanaDigraphTool;
