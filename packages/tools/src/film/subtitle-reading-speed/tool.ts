import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SubtitleReadingSpeedInput = Readonly<{
  readonly wordCount: number;
  readonly durationSeconds: number;
}>;
export type SubtitleReadingSpeedOutput = Readonly<{
  readonly wordsPerMinute: number;
}>;

export const calculateSubtitleReadingSpeed = (
  x: SubtitleReadingSpeedInput,
): SubtitleReadingSpeedOutput => {
  if (!Number.isFinite(x.wordCount) || x.wordCount < 0)
    simpleError("wordCount", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.durationSeconds) || x.durationSeconds < 0)
    simpleError("durationSeconds", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.wordCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const wordsPerMinute = (60 * x.wordCount) / x.durationSeconds;
  if (!Number.isFinite(wordsPerMinute))
    simpleError(
      "wordsPerMinute",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { wordsPerMinute: Object.is(wordsPerMinute, -0) ? 0 : wordsPerMinute };
};

export const example = {
  input: { wordCount: 12, durationSeconds: 3 },
  output: { wordsPerMinute: 240 },
} satisfies ToolExample<SubtitleReadingSpeedInput, SubtitleReadingSpeedOutput>;

export const tool = createSimpleTool({
  id: "film/subtitle-reading-speed",
  title: "Subtitle Reading Speed",
  description:
    "Subtitle reading speed in words per minute from displayed word count and on-screen duration.",
  inputs: [
    { id: "wordCount", kind: "integer", label: "Word Count", minimum: 0 },
    {
      id: "durationSeconds",
      kind: "number",
      label: "Duration Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "wordsPerMinute",
      kind: "number",
      label: "Words Per Minute",
      unit: "words/min",
    },
  ],
  calculate: (input) =>
    calculateSubtitleReadingSpeed({
      wordCount: input.wordCount as number,
      durationSeconds: input.durationSeconds as number,
    }),
});
export const subtitleReadingSpeedTool = tool;
export const runSubtitleReadingSpeed = tool.execute;
export default tool;
