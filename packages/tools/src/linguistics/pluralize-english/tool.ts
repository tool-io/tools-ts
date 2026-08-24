import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PluralizeEnglishInput = {
  readonly word: string;
};

export type PluralizeEnglishOutput = {
  readonly plural: string;
};

const irregularPlurals: Readonly<Record<string, string>> = {
  calf: "calves",
  child: "children",
  elf: "elves",
  foot: "feet",
  goose: "geese",
  half: "halves",
  knife: "knives",
  leaf: "leaves",
  life: "lives",
  loaf: "loaves",
  man: "men",
  mouse: "mice",
  person: "people",
  shelf: "shelves",
  thief: "thieves",
  tooth: "teeth",
  wife: "wives",
  wolf: "wolves",
  woman: "women",
};

const pluralizeEnglish = (word: string): string => {
  const irregular = irregularPlurals[word];
  if (irregular !== undefined) return irregular;
  if (
    word.endsWith("y") &&
    word.length > 1 &&
    !"aeiou".includes(word[word.length - 2])
  )
    return `${word.slice(0, -1)}ies`;
  if (/(s|x|z|ch|sh)$/u.test(word)) return `${word}es`;
  return `${word}s`;
};

export const pluralizeExample = {
  input: { word: "wolf" },
  output: { plural: "wolves" },
} satisfies ToolExample<PluralizeEnglishInput, PluralizeEnglishOutput>;

export const pluralizeTool = createSimpleTool({
  id: "linguistics/pluralize-english",
  title: "English Pluralizer",
  description:
    "Apply common English plural spelling rules and a small irregular-noun table to a lowercase noun. English exceptions are extensive, so treat the result as a rule-based suggestion rather than a dictionary lookup.",
  inputs: [{ id: "word", label: "Word", kind: "string" }],
  outputs: [{ id: "plural", label: "Plural form", kind: "string" }],
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
    return { plural: pluralizeEnglish(word) };
  },
});
export const runPluralizeEnglish = pluralizeTool.execute;
export default pluralizeTool;
