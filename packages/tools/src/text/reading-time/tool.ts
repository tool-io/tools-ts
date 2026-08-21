import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type ReadingTimeInput = {
  readonly words: number;
  readonly wordsPerMinute?: number;
};

export type ReadingTimeOutput = {
  readonly label: string;
  readonly minutes: number;
  readonly roundedMinutes: number;
};

export const readingTimeInputSchema = {
  additionalProperties: false,
  properties: {
    words: {
      description: "Word count of the text to read.",
      minimum: 0,
      type: "integer",
    },
    wordsPerMinute: {
      description: "Reading speed, defaulting to 200.",
      maximum: 500,
      minimum: 60,
      type: "integer",
    },
  },
  required: ["words"],
  type: "object",
} as const;

export const readingTimeOutputSchema = {
  additionalProperties: false,
  properties: {
    label: {
      description: 'Human-facing label such as "3 min read".',
      minLength: 1,
      type: "string",
    },
    minutes: {
      description: "Exact duration in minutes rounded to two decimals.",
      minimum: 0,
      type: "number",
    },
    roundedMinutes: {
      description: "Whole minutes, rounding up below one minute.",
      minimum: 0,
      type: "integer",
    },
  },
  required: ["minutes", "roundedMinutes", "label"],
  type: "object",
} as const;

export const readingTimeExample = {
  input: { words: 450, wordsPerMinute: 200 },
  output: { label: "3 min read", minutes: 2.25, roundedMinutes: 3 },
} satisfies ToolExample<ReadingTimeInput, ReadingTimeOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const round2 = (value: number): number => Math.round(value * 100) / 100;

const DEFAULT_WORDS_PER_MINUTE = 200;

export const isReadingTimeOutput = (
  value: unknown,
): value is ReadingTimeOutput =>
  isRecord(value) &&
  typeof value.label === "string" &&
  Number.isSafeInteger(value.roundedMinutes);

export const calculateReadingTime = (
  input: unknown,
): ToolResult<ReadingTimeOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set(["words", "wordsPerMinute"]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawWords = input.words;
  if (rawWords === undefined)
    return invalidInput([
      ...issues,
      {
        code: "words_required",
        field: "words",
        message: "words is required.",
      },
    ]);
  if (!Number.isSafeInteger(rawWords) || (rawWords as number) < 0)
    return invalidInput([
      ...issues,
      {
        code: "words_invalid",
        field: "words",
        message: "words must be a nonnegative safe integer.",
      },
    ]);

  const speedInput = input.wordsPerMinute;
  const wordsPerMinute =
    speedInput === undefined
      ? DEFAULT_WORDS_PER_MINUTE
      : (speedInput as number);
  if (
    !Number.isSafeInteger(wordsPerMinute) ||
    wordsPerMinute < 60 ||
    wordsPerMinute > 500
  )
    return invalidInput([
      ...issues,
      {
        code: "words_per_minute_invalid",
        field: "wordsPerMinute",
        message:
          "wordsPerMinute must be an integer between 60 and 500.",
      },
    ]);
  if (issues.length > 0) return invalidInput(issues);

  const exactMinutes =
    Math.round(((rawWords as number) / wordsPerMinute) * 100) / 100;
  const roundedMinutes =
    rawWords === 0 ? 0 : Math.max(1, Math.ceil(exactMinutes));
  const label =
    exactMinutes === 0
      ? "0 sec read"
      : exactMinutes < 1
        ? `${Math.max(5, Math.ceil((exactMinutes * 60) / 5) * 5)} sec read`
        : `${roundedMinutes} min read`;

  return toolSuccess({
    label,
    minutes: exactMinutes,
    roundedMinutes,
  });
};

export const readingTimeTool = defineTool<ReadingTimeInput, ReadingTimeOutput>({
  contractVersion: 1,
  description:
    "Estimate reading duration from a word count at a configurable words-per-minute pace.",
  discovery: {
    aliases: ["read-time-estimator"],
    keywords: ["blog", "content", "reading", "time"],
  },
  execute: calculateReadingTime,
  execution: { kind: "pure" },
  id: "text/reading-time",
  inputSchema: readingTimeInputSchema,
  outputSchema: readingTimeOutputSchema,
  ports: {
    inputs: [
      {
        description: "Word count of the text.",
        id: "words",
        label: "Words",
        required: true,
        valueType: { format: "count", type: "integer" },
      },
      {
        description: "Reading speed in words per minute.",
        id: "wordsPerMinute",
        label: "Speed",
        valueType: { format: "rate", type: "integer", unit: "wpm" },
      },
    ],
    outputs: [
      {
        description: "Exact duration rounded to two decimals.",
        id: "minutes",
        label: "Minutes",
        valueType: { format: "duration", type: "number", unit: "min" },
      },
      {
        description: "Whole-minute estimate for display.",
        id: "roundedMinutes",
        label: "Rounded minutes",
        valueType: { format: "count", type: "integer", unit: "min" },
      },
      {
        description: "Human-facing label such as 3 min read.",
        id: "label",
        label: "Label",
        valueType: { format: "display-string", type: "string" },
      },
    ],
  },
  title: "Reading Time",
});

export const runReadingTime = readingTimeTool.execute;
export default readingTimeTool;
