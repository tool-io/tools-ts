import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RubbingLegibilityGradeRaterInput = {
  readonly legibilityPercent: number;
};

export type RubbingLegibilityGradeRaterOutput = {
  readonly legibilityGrade: "poor" | "fair" | "good" | "excellent";
};

export const calculateRubbingLegibilityGradeRater = (
  input: RubbingLegibilityGradeRaterInput,
): RubbingLegibilityGradeRaterOutput => {
  if (!(input.legibilityPercent >= 0 && input.legibilityPercent <= 100))
    return simpleError(
      "legibilityPercent",
      "Legibility must be between 0 and 100 percent.",
      "invalid_legibility",
    );
  return {
    legibilityGrade:
      input.legibilityPercent >= 75
        ? "excellent"
        : input.legibilityPercent >= 50
          ? "good"
          : input.legibilityPercent >= 25
            ? "fair"
            : "poor",
  };
};

export const rubbingLegibilityGradeRaterExample = {
  input: { legibilityPercent: 45 },
  output: { legibilityGrade: "fair" },
} satisfies ToolExample<
  RubbingLegibilityGradeRaterInput,
  RubbingLegibilityGradeRaterOutput
>;

export const rubbingLegibilityGradeRaterTool = createSimpleTool({
  id: "epigraphy/rubbing-legibility-grade-rater",
  title: "Rubbing Wax Transfer Legibility Grade Rater",
  description:
    "Rate the letterform legibility of a wax or graphite rubbing on an equal-quartile scale from poor through fair and good to excellent.",
  inputs: [
    {
      description: "Share of transferred text that is readable, in percent.",
      id: "legibilityPercent",
      kind: "number",
      label: "Legibility",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Equal-quartile legibility grade.",
      id: "legibilityGrade",
      enum: ["poor", "fair", "good", "excellent"],
      kind: "string",
      label: "Grade",
    },
  ],
  calculate: (input) =>
    calculateRubbingLegibilityGradeRater(
      input as unknown as RubbingLegibilityGradeRaterInput,
    ),
});

export const runRubbingLegibilityGradeRater =
  rubbingLegibilityGradeRaterTool.execute;
export default rubbingLegibilityGradeRaterTool;
