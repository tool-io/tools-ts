import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SingularizeEnglishInput = {
  readonly word: string;
};

export type SingularizeEnglishOutput = {
  readonly singular: string;
};

const irregularSingulars: Readonly<Record<string, string>> = {
  calves: "calf",
  children: "child",
  elves: "elf",
  feet: "foot",
  geese: "goose",
  halves: "half",
  knives: "knife",
  leaves: "leaf",
  lives: "life",
  loaves: "loaf",
  men: "man",
  mice: "mouse",
  people: "person",
  shelves: "shelf",
  thieves: "thief",
  teeth: "tooth",
  wives: "wife",
  wolves: "wolf",
  women: "woman",
};

const singularizeEnglish = (word: string): string => {
  const irregular = irregularSingulars[word];
  if (irregular !== undefined) return irregular;
  if (word === "ties" || word === "lies" || word === "dies")
    return word.slice(0, -1);
  if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (/(s|x|z|ch|sh)es$/u.test(word)) return word.slice(0, -2);
  if (word.endsWith("ss") || word.length <= 2) return word;
  if (word.endsWith("s")) return word.slice(0, -1);
  return word;
};

export const singularizeExample = {
  input: { word: "wolves" },
  output: { singular: "wolf" },
} satisfies ToolExample<SingularizeEnglishInput, SingularizeEnglishOutput>;

export const singularizeTool = createSimpleTool({
  id: "linguistics/singularize-english",
  title: "English Singularizer",
  description:
    "Apply common English singular spelling rules and a small irregular-noun table to a lowercase plural noun. English exceptions are extensive, so treat the result as a rule-based suggestion rather than a dictionary lookup.",
  inputs: [{ id: "word", label: "Word", kind: "string" }],
  outputs: [{ id: "singular", label: "Singular form", kind: "string" }],
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
    return { singular: singularizeEnglish(word) };
  },
});
export const runSingularizeEnglish = singularizeTool.execute;
export default singularizeTool;
