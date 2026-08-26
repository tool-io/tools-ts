import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PalimpsestVisibilityGradeRaterInput = {
  readonly underTextVisibilityPercent: number;
};

export type PalimpsestVisibilityGradeRaterOutput = {
  readonly visibilityGrade: "negligible" | "faint" | "moderate" | "high";
};

export const calculatePalimpsestVisibilityGradeRater = (
  input: PalimpsestVisibilityGradeRaterInput,
): PalimpsestVisibilityGradeRaterOutput => {
  if (!(
    input.underTextVisibilityPercent >= 0 &&
    input.underTextVisibilityPercent <= 100
  ))
    return simpleError(
      "underTextVisibilityPercent",
      "Visibility must be between 0 and 100 percent.",
      "invalid_visibility",
    );
  return {
    visibilityGrade:
      input.underTextVisibilityPercent >= 75
        ? "high"
        : input.underTextVisibilityPercent >= 50
          ? "moderate"
          : input.underTextVisibilityPercent >= 25
            ? "faint"
            : "negligible",
  };
};

export const palimpsestVisibilityGradeRaterExample = {
  input: { underTextVisibilityPercent: 60 },
  output: { visibilityGrade: "moderate" },
} satisfies ToolExample<
  PalimpsestVisibilityGradeRaterInput,
  PalimpsestVisibilityGradeRaterOutput
>;

export const palimpsestVisibilityGradeRaterTool = createSimpleTool({
  id: "epigraphy/palimpsest-visibility-grade-rater",
  title: "Palimpsest Under-Text Trace Visibility Grade Rater",
  description:
    "Rate the visibility of palimpsest under-text traces on an equal-quartile scale from negligible through faint and moderate to high.",
  inputs: [
    {
      description: "Share of under-text trace that is legible, in percent.",
      id: "underTextVisibilityPercent",
      kind: "number",
      label: "Visibility",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Equal-quartile visibility grade.",
      id: "visibilityGrade",
      enum: ["negligible", "faint", "moderate", "high"],
      kind: "string",
      label: "Grade",
    },
  ],
  calculate: (input) =>
    calculatePalimpsestVisibilityGradeRater(
      input as unknown as PalimpsestVisibilityGradeRaterInput,
    ),
});

export const runPalimpsestVisibilityGradeRater =
  palimpsestVisibilityGradeRaterTool.execute;
export default palimpsestVisibilityGradeRaterTool;
