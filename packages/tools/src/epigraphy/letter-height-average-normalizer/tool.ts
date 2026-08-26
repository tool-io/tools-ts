import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LetterHeightAverageNormalizerInput = {
  readonly letterHeightsMm: readonly number[];
};

export type LetterHeightAverageNormalizerOutput = {
  readonly averageHeightMm: number;
  readonly shortestMm: number;
  readonly tallestMm: number;
  readonly sampleCount: number;
};

export const calculateLetterHeightAverageNormalizer = (
  input: LetterHeightAverageNormalizerInput,
): LetterHeightAverageNormalizerOutput => {
  const heights = input.letterHeightsMm;
  if (!Array.isArray(heights) || heights.length === 0)
    return simpleError(
      "letterHeightsMm",
      "At least one letter height is required.",
      "empty_heights",
    );
  for (const height of heights)
    if (!(typeof height === "number" && Number.isFinite(height) && height > 0))
      return simpleError(
        "letterHeightsMm",
        "Letter heights must be finite positive millimetre values.",
        "invalid_height",
      );
  const total = heights.reduce((sum, height) => sum + height, 0);
  return {
    averageHeightMm: total / heights.length,
    shortestMm: Math.min(...heights),
    tallestMm: Math.max(...heights),
    sampleCount: heights.length,
  };
};

export const letterHeightAverageNormalizerExample = {
  input: { letterHeightsMm: [10, 12, 14] },
  output: {
    averageHeightMm: 12,
    shortestMm: 10,
    tallestMm: 14,
    sampleCount: 3,
  },
} satisfies ToolExample<
  LetterHeightAverageNormalizerInput,
  LetterHeightAverageNormalizerOutput
>;

export const letterHeightAverageNormalizerTool = createSimpleTool({
  id: "epigraphy/letter-height-average-normalizer",
  title: "Letter Height Millimetre Average Measurer Normalizer",
  description:
    "Averages a series of measured letter heights in millimetres and reports the observed range.",
  inputs: [
    {
      id: "letterHeightsMm",
      kind: "numberList",
      label: "Letter heights",
      description: "Measured letter heights in millimetres.",
    },
  ],
  outputs: [
    {
      id: "averageHeightMm",
      kind: "number",
      label: "Average",
      description: "Mean letter height in millimetres.",
    },
    {
      id: "shortestMm",
      kind: "number",
      label: "Shortest",
      description: "Smallest measured height.",
    },
    {
      id: "tallestMm",
      kind: "number",
      label: "Tallest",
      description: "Largest measured height.",
    },
    {
      id: "sampleCount",
      kind: "integer",
      label: "Samples",
      description: "Number of measurements supplied.",
    },
  ],
  calculate: (input) =>
    calculateLetterHeightAverageNormalizer(
      input as unknown as LetterHeightAverageNormalizerInput,
    ),
});

export const runLetterHeightAverageNormalizer =
  letterHeightAverageNormalizerTool.execute;
export default letterHeightAverageNormalizerTool;
