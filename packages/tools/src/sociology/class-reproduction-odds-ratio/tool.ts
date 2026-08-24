import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ClassReproductionOddsRatioInput = {
  readonly bottomToBottom: number;
  readonly bottomToTop: number;
  readonly topToBottom: number;
  readonly topToTop: number;
};

export type ClassReproductionOddsRatioOutput = {
  readonly reproductionOddsRatio: number;
};

export const classReproductionOddsRatioExample = {
  input: {
    bottomToBottom: 30,
    bottomToTop: 20,
    topToBottom: 5,
    topToTop: 45,
  },
  output: {
    reproductionOddsRatio: 13.5,
  },
} satisfies ToolExample<
  ClassReproductionOddsRatioInput,
  ClassReproductionOddsRatioOutput
>;

export const calculateClassReproductionOddsRatio = (
  input: ClassReproductionOddsRatioInput,
): ClassReproductionOddsRatioOutput => {
  const cells = [
    input.bottomToBottom,
    input.bottomToTop,
    input.topToBottom,
    input.topToTop,
  ];
  if (cells.some((cell) => !Number.isSafeInteger(cell) || cell < 0))
    simpleError(
      "bottomToBottom",
      "Every mobility-table cell must be a nonnegative safe integer count.",
      "invalid_value",
    );
  if (input.topToBottom <= 0 || input.bottomToTop <= 0)
    simpleError(
      "topToBottom",
      "The off-diagonal cells must be positive to form the odds ratio.",
      "invalid_value",
    );
  const reproductionOddsRatio =
    (input.topToTop / input.topToBottom) *
    (input.bottomToBottom / input.bottomToTop);
  if (!Number.isFinite(reproductionOddsRatio))
    simpleError(
      "topToTop",
      "The odds ratio is outside the finite numeric range.",
      "numeric_range",
    );
  return { reproductionOddsRatio };
};

export const classReproductionOddsRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateClassReproductionOddsRatio({
      bottomToBottom: input.bottomToBottom as number,
      bottomToTop: input.bottomToTop as number,
      topToBottom: input.topToBottom as number,
      topToTop: input.topToTop as number,
    }),
  description:
    "Quantify class inheritance with the odds ratio comparing top-origin sons staying on top against bottom-origin sons rising.",
  id: "sociology/class-reproduction-odds-ratio",
  inputs: [
    {
      description: "Cases starting and ending in the bottom class.",
      id: "bottomToBottom",
      kind: "integer",
      label: "Bottom to bottom",
      minimum: 0,
    },
    {
      description: "Cases rising from the bottom to the top class.",
      id: "bottomToTop",
      kind: "integer",
      label: "Bottom to top",
      minimum: 0,
    },
    {
      description: "Cases falling from the top to the bottom class.",
      id: "topToBottom",
      kind: "integer",
      label: "Top to bottom",
      minimum: 0,
    },
    {
      description: "Cases starting and ending in the top class.",
      id: "topToTop",
      kind: "integer",
      label: "Top to top",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Odds ratio; values above one indicate stronger reproduction than exchange.",
      id: "reproductionOddsRatio",
      kind: "number",
      label: "Reproduction odds ratio",
    },
  ],
  title: "Class Reproduction Odds Ratio Calculator",
});
export const runClassReproductionOddsRatio =
  classReproductionOddsRatioTool.execute;
export default classReproductionOddsRatioTool;
