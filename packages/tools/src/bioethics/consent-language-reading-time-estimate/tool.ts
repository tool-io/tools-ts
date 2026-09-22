import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly words: number;
  readonly wordsPerMinute: number;
  readonly discussionMinutes: number;
};
export type Output = {
  readonly readingMinutes: number;
  readonly totalMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    words: { type: "integer", minimum: 0 },
    wordsPerMinute: { type: "number", exclusiveMinimum: 0 },
    discussionMinutes: { type: "number", minimum: 0 },
  },
  required: ["words", "wordsPerMinute", "discussionMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readingMinutes: { type: "number" },
    totalMinutes: { type: "number" },
  },
  required: ["readingMinutes", "totalMinutes"],
} as const;
/** Estimate duration from an explicit reading pace; elapsed reading time does not establish informed consent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { words, wordsPerMinute, discussionMinutes } = request;
  const compute = (): Output => {
    H.integer(words, 0);
    H.positive(wordsPerMinute);
    H.domain(discussionMinutes >= 0);
    return {
      readingMinutes: words / wordsPerMinute,
      totalMinutes: words / wordsPerMinute + discussionMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { words: 600, wordsPerMinute: 200, discussionMinutes: 10 },
  output: { readingMinutes: 3, totalMinutes: 13 },
} satisfies ToolExample<Input, Output>;
export const consentLanguageReadingTimeEstimateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/consent-language-reading-time-estimate",
    title: "Consent Language Reading Time Estimate Tool",
    description:
      "Estimate duration from an explicit reading pace; elapsed reading time does not establish informed consent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        words: { type: "integer", minimum: 0 },
        wordsPerMinute: { type: "number", exclusiveMinimum: 0 },
        discussionMinutes: { type: "number", minimum: 0 },
      },
      required: ["words", "wordsPerMinute", "discussionMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        readingMinutes: { type: "number" },
        totalMinutes: { type: "number" },
      },
      required: ["readingMinutes", "totalMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "words",
          label: "Words",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "wordsPerMinute",
          label: "Words Per Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discussionMinutes",
          label: "Discussion Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "readingMinutes",
          label: "Reading Minutes",
          valueType: { type: "number" },
        },
        {
          id: "totalMinutes",
          label: "Total Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = consentLanguageReadingTimeEstimateTool.execute;
export default consentLanguageReadingTimeEstimateTool;
