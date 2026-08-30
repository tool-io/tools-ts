import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly log2FoldChanges: readonly number[];
  readonly adjustedPValues: readonly number[];
  readonly minimumAbsoluteLog2Fc: number;
  readonly maximumAdjustedP: number;
}>;
export type Output = Readonly<{
  readonly quadrants: readonly string[];
  readonly upCount: number;
  readonly downCount: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.log2FoldChanges.length;
  if (
    n === 0 ||
    n !== input.adjustedPValues.length ||
    input.adjustedPValues.some((v) => v < 0 || v > 1) ||
    input.minimumAbsoluteLog2Fc < 0 ||
    input.maximumAdjustedP < 0 ||
    input.maximumAdjustedP > 1
  )
    simpleError(
      "adjustedPValues",
      "Aligned effect sizes and valid adjusted p-values required.",
    );
  const quadrants = input.log2FoldChanges.map((v, i) =>
    input.adjustedPValues[i] <= input.maximumAdjustedP &&
    Math.abs(v) >= input.minimumAbsoluteLog2Fc
      ? v > 0
        ? "up"
        : "down"
      : "not-significant",
  );
  return {
    quadrants,
    upCount: quadrants.filter((v) => v === "up").length,
    downCount: quadrants.filter((v) => v === "down").length,
  };
};

export const exampleInput = {
  log2FoldChanges: [2, -2, 0.1],
  adjustedPValues: [0.01, 0.01, 0.5],
  minimumAbsoluteLog2Fc: 1,
  maximumAdjustedP: 0.05,
} satisfies Input;
export const exampleOutput = {
  quadrants: ["up", "down", "not-significant"],
  upCount: 1,
  downCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/volcano-quadrant",
  title: "Volcano Quadrant",
  description:
    "Classify volcano-plot features with supplied effect and FDR thresholds.",
  inputs: [
    { id: "log2FoldChanges", kind: "numberList", label: "Log 2 fold changes" },
    { id: "adjustedPValues", kind: "numberList", label: "Adjusted p values" },
    {
      id: "minimumAbsoluteLog2Fc",
      kind: "number",
      label: "Minimum absolute log 2 fc",
    },
    { id: "maximumAdjustedP", kind: "number", label: "Maximum adjusted p" },
  ],
  outputs: [
    { id: "quadrants", kind: "stringList", label: "Quadrants" },
    { id: "upCount", kind: "number", label: "Up count" },
    { id: "downCount", kind: "number", label: "Down count" },
  ],
  calculate: (value) =>
    calculate({
      log2FoldChanges: value.log2FoldChanges as readonly number[],
      adjustedPValues: value.adjustedPValues as readonly number[],
      minimumAbsoluteLog2Fc: value.minimumAbsoluteLog2Fc as number,
      maximumAdjustedP: value.maximumAdjustedP as number,
    }),
});
export const run = tool.execute;
export default tool;
