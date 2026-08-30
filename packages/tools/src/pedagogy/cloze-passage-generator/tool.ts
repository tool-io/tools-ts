import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly passage: string;
  readonly deleteEveryNthWord: number;
  readonly firstDeletionOrdinal: number;
}>;
export type Output = Readonly<{
  readonly clozePassage: string;
  readonly deletedWords: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.deleteEveryNthWord) ||
    input.deleteEveryNthWord < 1 ||
    !Number.isSafeInteger(input.firstDeletionOrdinal) ||
    input.firstDeletionOrdinal < 1 ||
    input.firstDeletionOrdinal > input.deleteEveryNthWord
  )
    simpleError(
      "deleteEveryNthWord",
      "Valid word interval and first-deletion ordinal required.",
    );
  let ordinal = 0;
  const deletedWords: string[] = [];
  const clozePassage = input.passage.replace(
    /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu,
    (word) => {
      ordinal++;
      if (
        (ordinal - input.firstDeletionOrdinal) % input.deleteEveryNthWord !==
          0 ||
        ordinal < input.firstDeletionOrdinal
      )
        return word;
      deletedWords.push(word);
      return "____";
    },
  );
  if (ordinal === 0)
    simpleError("passage", "Passage must contain at least one word.");
  return { clozePassage, deletedWords };
};
export const exampleInput = {
  passage: "One two three four five six.",
  deleteEveryNthWord: 3,
  firstDeletionOrdinal: 3,
} satisfies Input;
export const exampleOutput = {
  clozePassage: "One two ____ four five ____.",
  deletedWords: ["three", "six"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/cloze-passage-generator",
  title: "Cloze Passage Generator",
  description:
    "Generate a cloze passage by deleting every Nth word while preserving punctuation.",
  inputs: [
    { id: "passage", label: "Passage", kind: "string" },
    {
      id: "deleteEveryNthWord",
      label: "Delete every nth word",
      kind: "number",
    },
    {
      id: "firstDeletionOrdinal",
      label: "First deletion ordinal",
      kind: "number",
    },
  ],
  outputs: [
    { id: "clozePassage", label: "Cloze passage", kind: "string" },
    { id: "deletedWords", label: "Deleted words", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      passage: value.passage as string,
      deleteEveryNthWord: value.deleteEveryNthWord as number,
      firstDeletionOrdinal: value.firstDeletionOrdinal as number,
    }),
});
export const run = tool.execute;
export default tool;
