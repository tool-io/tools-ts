import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InterpunctDensityCalculatorInput = {
  readonly lines: readonly string[];
};

export type InterpunctDensityCalculatorOutput = {
  readonly interpunctCount: number;
  readonly lineCount: number;
  readonly averagePerLine: number;
};

const INTERPUNCT_PATTERN = /[\u00b7]/g;

export const calculateInterpunctDensityCalculator = (
  input: InterpunctDensityCalculatorInput,
): InterpunctDensityCalculatorOutput => {
  const lines = input.lines;
  if (!Array.isArray(lines) || lines.length === 0)
    return simpleError(
      "lines",
      "At least one transcribed line is required.",
      "empty_lines",
    );
  let interpunctCount = 0;
  for (const line of lines)
    interpunctCount +=
      typeof line === "string"
        ? Array.from(line.matchAll(INTERPUNCT_PATTERN)).length
        : simpleError("lines", "Every line must be a string.", "invalid_line");
  return {
    interpunctCount,
    lineCount: lines.length,
    averagePerLine: interpunctCount / lines.length,
  };
};

export const interpunctDensityCalculatorExample = {
  input: { lines: ["DIS\u00b7MANIBVS", "IVLIA\u00b7PRIMA"] },
  output: { interpunctCount: 2, lineCount: 2, averagePerLine: 1 },
} satisfies ToolExample<
  InterpunctDensityCalculatorInput,
  InterpunctDensityCalculatorOutput
>;

export const interpunctDensityCalculatorTool = createSimpleTool({
  id: "epigraphy/interpunct-density-calculator",
  title: "Interpunct Word Divider Density per Line Calculator",
  description:
    "Counts middle-dot interpunct word dividers across transcription lines and reports their average density per line.",
  inputs: [
    {
      id: "lines",
      kind: "stringList",
      label: "Lines",
      description: "Transcribed inscription lines.",
    },
  ],
  outputs: [
    {
      id: "interpunctCount",
      kind: "integer",
      label: "Interpuncts",
      description: "Total middle-dot dividers counted.",
    },
    {
      id: "lineCount",
      kind: "integer",
      label: "Lines",
      description: "Number of supplied lines.",
    },
    {
      id: "averagePerLine",
      kind: "number",
      label: "Average per line",
      description: "Interpuncts divided by line count.",
    },
  ],
  calculate: (input) =>
    calculateInterpunctDensityCalculator(
      input as unknown as InterpunctDensityCalculatorInput,
    ),
});

export const runInterpunctDensityCalculator =
  interpunctDensityCalculatorTool.execute;
export default interpunctDensityCalculatorTool;
