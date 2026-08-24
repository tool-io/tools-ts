import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IrongallCorrosionGradeRaterInput = {
  readonly inkLossScore: number;
  readonly burnThroughScore: number;
  readonly haloBleedingScore: number;
  readonly mechanicalWeaknessScore: number;
};

export type IrongallCorrosionGradeRaterOutput = {
  readonly meanIndicatorScore: number;
  readonly corrosionGrade: number;
  readonly gradeLabel: "none" | "slight" | "moderate" | "severe";
};

const INDICATORS = [
  "inkLossScore",
  "burnThroughScore",
  "haloBleedingScore",
  "mechanicalWeaknessScore",
] as const;

export const calculateIrongallCorrosionGradeRater = (
  input: IrongallCorrosionGradeRaterInput,
): IrongallCorrosionGradeRaterOutput => {
  for (const key of INDICATORS) {
    const value = input[key];
    if (!(Number.isInteger(value) && value >= 0 && value <= 3))
      return simpleError(
        key,
        "Each indicator score must be an integer from 0 (absent) to 3 (severe).",
        "invalid_score",
      );
  }
  const mean =
    (input.inkLossScore +
      input.burnThroughScore +
      input.haloBleedingScore +
      input.mechanicalWeaknessScore) /
    INDICATORS.length;
  const grade = Math.round(mean);
  return {
    meanIndicatorScore: mean,
    corrosionGrade: grade,
    gradeLabel:
      grade === 0
        ? "none"
        : grade === 1
          ? "slight"
          : grade === 2
            ? "moderate"
            : "severe",
  };
};

export const irongallCorrosionGradeRaterExample = {
  input: {
    inkLossScore: 2,
    burnThroughScore: 1,
    haloBleedingScore: 2,
    mechanicalWeaknessScore: 3,
  },
  output: { meanIndicatorScore: 2, corrosionGrade: 2, gradeLabel: "moderate" },
} satisfies ToolExample<
  IrongallCorrosionGradeRaterInput,
  IrongallCorrosionGradeRaterOutput
>;

export const irongallCorrosionGradeRaterTool = createSimpleTool({
  id: "paleography/irongall-corrosion-grade-rater",
  title: "Iron-Gall Corrosion Grade Rater",
  description:
    "Rate iron-gall ink corrosion on the stated transparent rule: each of four indicators (ink loss, burn-through, halo bleeding, mechanical weakness of the sheet) is scored 0-3 by the observer, and the grade is the rounded mean with labels none/slight/moderate/severe for 0/1/2/3.",
  inputs: [
    {
      description: "Ink loss or flaking severity, 0-3.",
      id: "inkLossScore",
      kind: "integer",
      label: "Ink loss",
      minimum: 0,
      maximum: 3,
    },
    {
      description: "Burn-through of the support, 0-3.",
      id: "burnThroughScore",
      kind: "integer",
      label: "Burn-through",
      minimum: 0,
      maximum: 3,
    },
    {
      description: "Brown halo bleeding around strokes, 0-3.",
      id: "haloBleedingScore",
      kind: "integer",
      label: "Halo bleeding",
      minimum: 0,
      maximum: 3,
    },
    {
      description: "Mechanical weakness (cracking, tearing) of the sheet, 0-3.",
      id: "mechanicalWeaknessScore",
      kind: "integer",
      label: "Sheet weakness",
      minimum: 0,
      maximum: 3,
    },
  ],
  outputs: [
    {
      description: "Unrounded mean of the four indicator scores.",
      id: "meanIndicatorScore",
      kind: "number",
      label: "Mean score",
    },
    {
      description: "Corrosion grade: rounded mean score on the 0-3 scale.",
      id: "corrosionGrade",
      kind: "integer",
      label: "Corrosion grade",
    },
    {
      description: "Label for the grade band.",
      id: "gradeLabel",
      enum: ["none", "slight", "moderate", "severe"],
      kind: "string",
      label: "Grade label",
    },
  ],
  calculate: (input) =>
    calculateIrongallCorrosionGradeRater({
      burnThroughScore: input.burnThroughScore as number,
      haloBleedingScore: input.haloBleedingScore as number,
      inkLossScore: input.inkLossScore as number,
      mechanicalWeaknessScore: input.mechanicalWeaknessScore as number,
    }),
});

export const runIrongallCorrosionGradeRater =
  irongallCorrosionGradeRaterTool.execute;
export default irongallCorrosionGradeRaterTool;
