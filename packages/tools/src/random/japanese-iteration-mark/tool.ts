// Repertoire source: https://www.unicode.org/charts/PDF/U3000.pdf
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomJapaneseIterationMarkInput = Readonly<Record<string, never>>;
export type RandomJapaneseIterationMarkOutput = { readonly value: string };

const source = { values: ["々", "〻", "ゝ", "ゞ", "ヽ", "ヾ"] } as const;

export const randomJapaneseIterationMarkValueCount = 6;

export const calculateRandomJapaneseIterationMark = (
  random: RandomSource = Math.random,
): RandomJapaneseIterationMarkOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomJapaneseIterationMarkExample = { input: {} } satisfies ToolExample<
  RandomJapaneseIterationMarkInput,
  RandomJapaneseIterationMarkOutput
>;

export const randomJapaneseIterationMarkTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomJapaneseIterationMark(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one encoded Japanese ideographic, vertical ideographic, Hiragana, or Katakana iteration mark using injected randomness.",
  id: "random/japanese-iteration-mark",
  inputs: [],
  outputs: [
    {
      format: "random/japanese-iteration-mark",
      id: "value",
      kind: "string",
      label: "Random Japanese Iteration Mark",
    },
  ],
  title: "Random Japanese Iteration Mark Generator",
});

export const runRandomJapaneseIterationMark = randomJapaneseIterationMarkTool.execute;
export default randomJapaneseIterationMarkTool;
