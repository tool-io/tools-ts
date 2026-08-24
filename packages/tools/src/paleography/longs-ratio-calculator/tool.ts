import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LongsRatioCalculatorInput = {
  readonly text: string;
};

export type LongsRatioCalculatorOutput = {
  readonly longSCount: number;
  readonly roundSCount: number;
  readonly longSPercentageOfS: number;
  readonly longSPerThousandCharacters: number;
};

export const calculateLongsRatioCalculator = (
  input: LongsRatioCalculatorInput,
): LongsRatioCalculatorOutput => {
  if (input.text.length === 0)
    return simpleError(
      "text",
      "Provide a non-empty text sample.",
      "invalid_text",
    );
  const countChar = (text: string, glyph: string): number =>
    text.split(glyph).length - 1;
  const longSCount = countChar(input.text, "\u017F");
  const roundSCount = countChar(input.text, "s");
  if (longSCount + roundSCount === 0)
    return simpleError(
      "text",
      "The sample contains no long or round s characters.",
      "invalid_text",
    );
  return {
    longSCount,
    roundSCount,
    longSPercentageOfS: (longSCount / (longSCount + roundSCount)) * 100,
    longSPerThousandCharacters: (longSCount / [...input.text].length) * 1000,
  };
};

export const longsRatioCalculatorExample = {
  input: { text: "paſsus" },
  output: {
    longSCount: 1,
    roundSCount: 2,
    longSPercentageOfS: 33.33333333333333,
    longSPerThousandCharacters: 166.66666666666666,
  },
} satisfies ToolExample<LongsRatioCalculatorInput, LongsRatioCalculatorOutput>;

export const longsRatioCalculatorTool = createSimpleTool({
  id: "paleography/longs-ratio-calculator",
  title: "Long-s Ratio Calculator",
  description:
    "Count long s (\u017F) and round s characters in a transcription and report the exact long-s share of all s glyphs plus its frequency per thousand characters.",
  inputs: [
    {
      description: "Transcription sample to scan.",
      id: "text",
      kind: "string",
      label: "Text sample",
    },
  ],
  outputs: [
    {
      description: "Occurrences of \u017F.",
      id: "longSCount",
      kind: "integer",
      label: "Long s",
    },
    {
      description: "Occurrences of plain s.",
      id: "roundSCount",
      kind: "integer",
      label: "Round s",
    },
    {
      description: "Long s as a percentage of all s glyphs.",
      id: "longSPercentageOfS",
      kind: "number",
      label: "% of s",
    },
    {
      description: "Long s occurrences per thousand characters.",
      id: "longSPerThousandCharacters",
      kind: "number",
      label: "Per 1000 chars",
    },
  ],
  calculate: (input) =>
    calculateLongsRatioCalculator({ text: input.text as string }),
});

export const runLongsRatioCalculator = longsRatioCalculatorTool.execute;
export default longsRatioCalculatorTool;
