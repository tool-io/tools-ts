import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PastTenseRegularInput = {
  readonly word: string;
};

export type PastTenseRegularOutput = {
  readonly pastTense: string;
};

const isConsonant = (character: string): boolean =>
  /[b-df-hj-np-tv-z]/u.test(character);

const regularPastTense = (word: string): string => {
  if (word.endsWith("e")) return `${word}d`;
  if (
    word.endsWith("y") &&
    word.length > 1 &&
    isConsonant(word[word.length - 2])
  )
    return `${word.slice(0, -1)}ied`;
  if (
    word.length >= 3 &&
    word.length <= 5 &&
    (word.match(/[aeiouy]+/gu) ?? []).length === 1 &&
    isConsonant(word[word.length - 3]) &&
    "aeiou".includes(word[word.length - 2]) &&
    isConsonant(word[word.length - 1]) &&
    !"wxy".includes(word[word.length - 1])
  ) {
    const finalConsonant = word[word.length - 1];
    return `${word}${finalConsonant}ed`;
  }
  return `${word}ed`;
};

export const pastTenseExample = {
  input: { word: "stop" },
  output: { pastTense: "stopped" },
} satisfies ToolExample<PastTenseRegularInput, PastTenseRegularOutput>;

export const pastTenseTool = createSimpleTool({
  id: "linguistics/past-tense-regular",
  title: "Regular Past Tense",
  description:
    "Apply common -ed spelling rules to a lowercase regular English verb, including consonant-y and short one-syllable CVC forms. Stress-dependent doubling and irregular verbs require a dictionary and are outside this heuristic.",
  inputs: [{ id: "word", label: "Verb", kind: "string" }],
  outputs: [{ id: "pastTense", label: "Past tense form", kind: "string" }],
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
    return { pastTense: regularPastTense(word) };
  },
});
export const runPastTenseRegular = pastTenseTool.execute;
export default pastTenseTool;
