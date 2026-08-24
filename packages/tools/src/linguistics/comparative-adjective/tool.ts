import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ComparativeAdjectiveInput = {
  readonly word: string;
};

export type ComparativeAdjectiveOutput = {
  readonly comparative: string;
};

const isConsonant = (character: string): boolean =>
  /[b-df-hj-np-tv-z]/u.test(character);

const vowelGroupCount = (word: string): number =>
  (word.match(/[aeiouy]+/gu) ?? []).length;

const comparativeAdjective = (word: string): string => {
  if (word.endsWith("e")) return `${word}r`;
  if (
    word.endsWith("y") &&
    word.length > 1 &&
    isConsonant(word[word.length - 2])
  )
    return `${word.slice(0, -1)}ier`;
  if (vowelGroupCount(word) === 1) {
    const finalConsonant = word[word.length - 1];
    if (
      word.length >= 3 &&
      isConsonant(word[word.length - 3]) &&
      "aeiou".includes(word[word.length - 2]) &&
      isConsonant(finalConsonant) &&
      !"wxy".includes(finalConsonant)
    )
      return `${word}${finalConsonant}er`;
    return `${word}er`;
  }
  return `more ${word}`;
};

export const comparativeExample = {
  input: { word: "happy" },
  output: { comparative: "happier" },
} satisfies ToolExample<ComparativeAdjectiveInput, ComparativeAdjectiveOutput>;

export const comparativeTool = createSimpleTool({
  id: "linguistics/comparative-adjective",
  title: "Comparative Adjective",
  description:
    "Apply common English comparative spelling rules to a lowercase adjective, choosing -er for simple one-syllable forms and “more” otherwise. Irregular forms such as good/better require a dictionary and are outside this heuristic.",
  inputs: [{ id: "word", label: "Adjective", kind: "string" }],
  outputs: [{ id: "comparative", label: "Comparative form", kind: "string" }],
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
    return { comparative: comparativeAdjective(word) };
  },
});
export const runComparativeAdjective = comparativeTool.execute;
export default comparativeTool;
