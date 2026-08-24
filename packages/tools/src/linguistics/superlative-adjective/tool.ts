import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SuperlativeAdjectiveInput = {
  readonly word: string;
};

export type SuperlativeAdjectiveOutput = {
  readonly superlative: string;
};

const isConsonant = (character: string): boolean =>
  /[b-df-hj-np-tv-z]/u.test(character);

const vowelGroupCount = (word: string): number =>
  (word.match(/[aeiouy]+/gu) ?? []).length;

const superlativeAdjective = (word: string): string => {
  if (word.endsWith("e")) return `${word}st`;
  if (
    word.endsWith("y") &&
    word.length > 1 &&
    isConsonant(word[word.length - 2])
  )
    return `${word.slice(0, -1)}iest`;
  if (vowelGroupCount(word) === 1) {
    const finalConsonant = word[word.length - 1];
    if (
      word.length >= 3 &&
      isConsonant(word[word.length - 3]) &&
      "aeiou".includes(word[word.length - 2]) &&
      isConsonant(finalConsonant) &&
      !"wxy".includes(finalConsonant)
    )
      return `${word}${finalConsonant}est`;
    return `${word}est`;
  }
  return `most ${word}`;
};

export const superlativeExample = {
  input: { word: "big" },
  output: { superlative: "biggest" },
} satisfies ToolExample<SuperlativeAdjectiveInput, SuperlativeAdjectiveOutput>;

export const superlativeTool = createSimpleTool({
  id: "linguistics/superlative-adjective",
  title: "Superlative Adjective",
  description:
    "Apply common English superlative spelling rules to a lowercase adjective, choosing -est for simple one-syllable forms and “most” otherwise. Irregular forms such as good/best require a dictionary and are outside this heuristic.",
  inputs: [{ id: "word", label: "Adjective", kind: "string" }],
  outputs: [{ id: "superlative", label: "Superlative form", kind: "string" }],
  calculate: (input) => {
    const word = input.word as string;
    if (word.length === 0)
      simpleError("word", "Word must not be empty.", "empty_word");
    if (!/^[a-z]+$/.test(word))
      simpleError(
        "word",
        "Enter one lowercase English word using letters a-z.",
        "invalid_word",
      );
    return { superlative: superlativeAdjective(word) };
  },
});
export const runSuperlativeAdjective = superlativeTool.execute;
export default superlativeTool;
