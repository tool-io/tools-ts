import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LineCountEstimatorInput = {
  readonly totalCharacters: number;
  readonly charactersPerLine: number;
};

export type LineCountEstimatorOutput = {
  readonly rawLineCount: number;
  readonly estimatedLineCount: number;
};

export const calculateLineCountEstimator = (
  input: LineCountEstimatorInput,
): LineCountEstimatorOutput => {
  if (!(Number.isInteger(input.totalCharacters) && input.totalCharacters > 0))
    simpleError(
      "totalCharacters",
      "Total character count must be greater than zero.",
      "invalid_count",
    );
  if (!(input.charactersPerLine > 0))
    simpleError(
      "charactersPerLine",
      "Characters per line must be greater than zero.",
      "invalid_width",
    );
  const rawLineCount = input.totalCharacters / input.charactersPerLine;
  return { rawLineCount, estimatedLineCount: Math.ceil(rawLineCount) };
};

export const lineCountEstimatorExample = {
  input: { totalCharacters: 250, charactersPerLine: 30 },
  output: { rawLineCount: 8.333333333333334, estimatedLineCount: 9 },
} satisfies ToolExample<LineCountEstimatorInput, LineCountEstimatorOutput>;

export const lineCountEstimatorTool = createSimpleTool({
  id: "epigraphy/line-count-estimator",
  title: "Line Count from Text Length and Column Width Estimator",
  description:
    "Estimate how many inscribed lines a text of given character length occupies at an average column width in characters per line, rounding up to whole lines.",
  inputs: [
    {
      description: "Total characters of reconstructed text.",
      id: "totalCharacters",
      kind: "integer",
      label: "Text length",
      minimum: 1,
    },
    {
      description: "Average characters per inscribed line.",
      id: "charactersPerLine",
      kind: "number",
      label: "Column width",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Unrounded quotient of text length by column width.",
      id: "rawLineCount",
      kind: "number",
      label: "Raw lines",
    },
    {
      description: "Whole-line estimate rounded up.",
      id: "estimatedLineCount",
      kind: "integer",
      label: "Estimated lines",
    },
  ],
  calculate: (input) =>
    calculateLineCountEstimator(input as unknown as LineCountEstimatorInput),
});

export const runLineCountEstimator = lineCountEstimatorTool.execute;
export default lineCountEstimatorTool;
