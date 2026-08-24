import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OralHistoryAbstractLimitFinderInput = {
  readonly abstractText: string;
  readonly wordLimit?: number;
};

export type OralHistoryAbstractLimitFinderOutput = {
  readonly totalWords: number;
  readonly keptWordCount: number;
  readonly truncated: boolean;
  readonly truncatedAbstract: string;
};

export const calculateOralHistoryAbstractLimitFinder = (
  input: OralHistoryAbstractLimitFinderInput,
): OralHistoryAbstractLimitFinderOutput => {
  const raw = input.abstractText;
  if (typeof raw !== "string")
    simpleError(
      "abstractText",
      "Abstract text must be a string.",
      "invalid_abstract",
    );
  const words = raw
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  if (words.length === 0)
    simpleError(
      "abstractText",
      "Abstract text must contain at least one word.",
      "invalid_abstract",
    );
  const wordLimitRaw = input.wordLimit ?? 100;
  if (
    !Number.isFinite(wordLimitRaw) ||
    !Number.isSafeInteger(wordLimitRaw) ||
    wordLimitRaw < 1
  )
    simpleError(
      "wordLimit",
      "Word limit must be a safe integer at least 1.",
      "invalid_word_limit",
    );
  const wordLimit = wordLimitRaw;
  const keptWords = words.slice(0, wordLimit);
  return {
    totalWords: words.length,
    keptWordCount: keptWords.length,
    truncated: words.length > wordLimit,
    truncatedAbstract: keptWords.join(" "),
  };
};

export const oralHistoryAbstractLimitFinderExample = {
  input: {
    abstractText:
      "Interview begins with childhood memories in Osaka before the family moved to Seattle",
    wordLimit: 5,
  },
  output: {
    totalWords: 13,
    keptWordCount: 5,
    truncated: true,
    truncatedAbstract: "Interview begins with childhood memories",
  },
} satisfies ToolExample<
  OralHistoryAbstractLimitFinderInput,
  OralHistoryAbstractLimitFinderOutput
>;

export const oralHistoryAbstractLimitFinderTool = createSimpleTool({
  id: "archival-studies/oral-history-abstract-limit-finder",
  title: "Oral History Abstract Word Limit Truncation Point Finder",
  description:
    "Locate the truncation point for an oral history abstract by counting its words and returning the leading portion that fits a word limit.",
  inputs: [
    {
      description: "Full abstract text of the interview summary.",
      id: "abstractText",
      kind: "string",
      label: "Abstract",
    },
    {
      default: 100,
      description: "Maximum words retained in the truncated abstract.",
      id: "wordLimit",
      kind: "integer",
      label: "Word limit",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Total whitespace-delimited words in the abstract.",
      id: "totalWords",
      kind: "integer",
      label: "Total words",
    },
    {
      description: "Words retained within the limit.",
      id: "keptWordCount",
      kind: "integer",
      label: "Kept words",
    },
    {
      description: "True when the abstract exceeded the word limit.",
      id: "truncated",
      kind: "boolean",
      label: "Truncated",
    },
    {
      description: "Abstract cut to the word limit.",
      id: "truncatedAbstract",
      kind: "string",
      label: "Truncated abstract",
    },
  ],
  calculate: (input) =>
    calculateOralHistoryAbstractLimitFinder({
      abstractText: input.abstractText as string,
      wordLimit: (input.wordLimit as number | undefined) ?? undefined,
    }),
});

export const runOralHistoryAbstractLimitFinder =
  oralHistoryAbstractLimitFinderTool.execute;
export default oralHistoryAbstractLimitFinderTool;
