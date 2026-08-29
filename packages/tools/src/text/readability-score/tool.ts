import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type ReadabilityScoreInput = {
  readonly text: string;
};

export type ReadabilityScoreOutput = {
  readonly fleschKincaidGrade: number;
  readonly fleschReadingEase: number;
  readonly sentenceCount: number;
  readonly syllableCount: number;
  readonly wordCount: number;
};

export const readabilityScoreInputSchema = {
  additionalProperties: false,
  properties: {
    text: {
      description: "English prose to score.",
      maxLength: 1000000,
      type: "string",
    },
  },
  required: ["text"],
  type: "object",
} as const;

export const readabilityScoreOutputSchema = {
  additionalProperties: false,
  properties: {
    fleschKincaidGrade: {
      description: "Flesch-Kincaid grade level, rounded to two decimals.",
      type: "number",
    },
    fleschReadingEase: {
      description: "Flesch reading ease, rounded to two decimals.",
      type: "number",
    },
    sentenceCount: {
      description: "Sentences detected by terminal punctuation.",
      minimum: 0,
      type: "integer",
    },
    syllableCount: {
      description: "Estimated syllables via the vowel-group heuristic.",
      minimum: 0,
      type: "integer",
    },
    wordCount: {
      description: "Whitespace-separated words containing letters.",
      minimum: 0,
      type: "integer",
    },
  },
  required: [
    "fleschReadingEase",
    "fleschKincaidGrade",
    "wordCount",
    "sentenceCount",
    "syllableCount",
  ],
  type: "object",
} as const;

export const readabilityScoreExample = {
  input: { text: "The sun is hot. Dogs run fast." },
  output: {
    fleschKincaidGrade: -2.42,
    fleschReadingEase: 118.68,
    sentenceCount: 2,
    syllableCount: 7,
    wordCount: 7,
  },
} satisfies ToolExample<ReadabilityScoreInput, ReadabilityScoreOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const round2 = (value: number): number => Math.round(value * 100) / 100;

/** Counts vowel groups, with the classic silent-e adjustment. */
const countSyllables = (word: string): number => {
  const groups = word
    .toLowerCase()
    .replaceAll(/[^a-z]/g, "")
    .match(/[aeiouy]+/g);
  if (!groups) return 0;
  let count = groups.length;
  if (count > 1 && /(?:[^aeiouy])e$/.test(word.toLowerCase())) count -= 1;
  return count;
};

const splitWords = (text: string): string[] =>
  text.split(/\s+/).filter((word) => /[a-zA-Z]/.test(word));

const splitSentences = (text: string): string[] =>
  text
    .split(/[.!?]+(?:\s|$)/)
    .map((part) => part.trim())
    .filter(Boolean);

export const isReadabilityScoreOutput = (
  value: unknown,
): value is ReadabilityScoreOutput =>
  isRecord(value) &&
  typeof value.fleschReadingEase === "number" &&
  Number.isSafeInteger(value.wordCount);

export const calculateReadabilityScore = (
  input: unknown,
): ToolResult<ReadabilityScoreOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "text")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawText = input.text;
  if (rawText === undefined)
    issues.push({
      code: "text_required",
      field: "text",
      message: "text is required.",
    });
  else if (typeof rawText !== "string")
    issues.push({
      code: "text_invalid",
      field: "text",
      message: "text must be a string.",
    });
  else {
    const limitIssue = resourceLimitIssue(
      "textCharacters",
      rawText.length,
      "text",
    );
    if (limitIssue) issues.push(limitIssue);
  }
  if (issues.length > 0) return invalidInput(issues);

  const text = rawText as string;
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    issues.push({
      code: "text_empty",
      field: "text",
      message: "text must contain at least one word.",
    });
    return invalidInput(issues);
  }

  const words = splitWords(trimmed);
  const sentences = splitSentences(trimmed);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  const safeSentences = Math.max(1, sentences.length);
  const safeWords = Math.max(1, words.length);
  const wordsPerSentence = words.length / safeSentences;
  const syllablesPerWord = syllables / safeWords;

  return toolSuccess({
    fleschKincaidGrade: round2(
      0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59,
    ),
    fleschReadingEase: round2(
      206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord,
    ),
    sentenceCount: sentences.length,
    syllableCount: syllables,
    wordCount: words.length,
  });
};

export const readabilityScoreTool = defineTool<
  ReadabilityScoreInput,
  ReadabilityScoreOutput
>({
  contractVersion: 1,
  description:
    "Score English text readability using Flesch reading ease and Flesch-Kincaid grade heuristics.",
  discovery: {
    aliases: ["flesch-kincaid", "reading-level", "text-difficulty"],
    keywords: ["flesch", "readability", "reading", "writing"],
  },
  execute: calculateReadabilityScore,
  execution: { kind: "pure" },
  id: "text/readability-score",
  inputSchema: readabilityScoreInputSchema,
  outputSchema: readabilityScoreOutputSchema,
  ports: {
    inputs: [
      {
        description: "English prose to score.",
        id: "text",
        label: "Text",
        required: true,
        valueType: { format: "document/text", type: "string" },
      },
    ],
    outputs: [
      {
        description: "Flesch reading ease rounded to two decimals.",
        id: "fleschReadingEase",
        label: "Reading ease",
        valueType: { format: "readability-score", type: "number" },
      },
      {
        description: "Flesch-Kincaid grade level rounded to two decimals.",
        id: "fleschKincaidGrade",
        label: "Grade level",
        valueType: { format: "grade-level", type: "number" },
      },
      {
        description: "Detected words containing letters.",
        id: "wordCount",
        label: "Words",
        valueType: { format: "count", type: "integer" },
      },
      {
        description: "Detected sentences.",
        id: "sentenceCount",
        label: "Sentences",
        valueType: { format: "count", type: "integer" },
      },
      {
        description: "Heuristic syllable estimate.",
        id: "syllableCount",
        label: "Syllables",
        valueType: { format: "count", type: "integer" },
      },
    ],
  },
  title: "Readability Score",
});

export const runReadabilityScore = readabilityScoreTool.execute;
export default readabilityScoreTool;
