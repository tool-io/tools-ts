import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FormulaPositionTrendAnalyzerInput = {
  readonly corpusLines: readonly string[];
  readonly formulaWord: string;
};

export type FormulaPositionTrendAnalyzerOutput = {
  readonly linesWithFormula: number;
  readonly meanPosition: number;
  readonly trend: "initial" | "medial" | "terminal";
};

export const calculateFormulaPositionTrendAnalyzer = (
  input: FormulaPositionTrendAnalyzerInput,
): FormulaPositionTrendAnalyzerOutput => {
  const word = input.formulaWord.trim().toLowerCase();
  if (!word)
    return simpleError(
      "formulaWord",
      "The formula word must be a non-empty string.",
      "empty_word",
    );
  const positions: number[] = [];
  for (const line of input.corpusLines) {
    if (!line.trim())
      return simpleError(
        "corpusLines",
        "Corpus lines must be non-empty strings.",
        "empty_line",
      );
    const index = line.toLowerCase().indexOf(word);
    if (index >= 0) positions.push(index / line.length);
  }
  if (positions.length === 0)
    return simpleError(
      "corpusLines",
      "The formula word does not occur in any corpus line.",
      "formula_absent",
    );
  const meanPosition =
    positions.reduce((sum, value) => sum + value, 0) / positions.length;
  return {
    linesWithFormula: positions.length,
    meanPosition,
    trend:
      meanPosition < 1 / 3
        ? "initial"
        : meanPosition < 2 / 3
          ? "medial"
          : "terminal",
  };
};

export const formulaPositionTrendAnalyzerExample = {
  input: {
    corpusLines: ["Dis Manibus Sacrum", "dis manibus et memoriae"],
    formulaWord: "manibus",
  },
  output: {
    linesWithFormula: 2,
    meanPosition: 0.19806763285024154,
    trend: "initial",
  },
} satisfies ToolExample<
  FormulaPositionTrendAnalyzerInput,
  FormulaPositionTrendAnalyzerOutput
>;

export const formulaPositionTrendAnalyzerTool = createSimpleTool({
  id: "epigraphy/formula-position-trend-analyzer",
  title: "Formula Word Position Trend Across Corpus Analyzer",
  description:
    "Locate a formula word in each corpus line (case-insensitive first occurrence), average its relative position from 0 (line start) to 1 (line end), and label the trend initial (<1/3), medial (<2/3), or terminal.",
  inputs: [
    {
      description: "Inscription lines of the corpus.",
      id: "corpusLines",
      kind: "stringList",
      label: "Corpus lines",
    },
    {
      description: "Formula word to track across the corpus.",
      id: "formulaWord",
      kind: "string",
      label: "Formula word",
    },
  ],
  outputs: [
    {
      description: "Number of lines containing the formula word.",
      id: "linesWithFormula",
      kind: "number",
      label: "Lines with formula",
    },
    {
      description: "Mean relative first-occurrence position between 0 and 1.",
      id: "meanPosition",
      kind: "number",
      label: "Mean position",
    },
    {
      description: "Banded trend of the mean position.",
      enum: ["initial", "medial", "terminal"],
      id: "trend",
      kind: "string",
      label: "Trend",
    },
  ],
  calculate: (input) =>
    calculateFormulaPositionTrendAnalyzer(
      input as unknown as FormulaPositionTrendAnalyzerInput,
    ),
});

export const runFormulaPositionTrendAnalyzer =
  formulaPositionTrendAnalyzerTool.execute;
export default formulaPositionTrendAnalyzerTool;
