import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DuncanSeiSocioeconomicIndexInput = {
  readonly highIncomePercent: number;
  readonly highSchoolGraduatePercent: number;
};

export type DuncanSeiSocioeconomicIndexOutput = {
  readonly socioeconomicIndex: number;
};

export const duncanSeiSocioeconomicIndexExample = {
  input: {
    highIncomePercent: 60,
    highSchoolGraduatePercent: 80,
  },
  output: {
    socioeconomicIndex: 73.4,
  },
} satisfies ToolExample<
  DuncanSeiSocioeconomicIndexInput,
  DuncanSeiSocioeconomicIndexOutput
>;

export const calculateDuncanSei = (
  input: DuncanSeiSocioeconomicIndexInput,
): DuncanSeiSocioeconomicIndexOutput => {
  if (
    !Number.isFinite(input.highIncomePercent) ||
    input.highIncomePercent < 0 ||
    input.highIncomePercent > 100
  )
    simpleError(
      "highIncomePercent",
      "The high-income share must be between zero and one hundred percent.",
      "invalid_value",
    );
  if (
    !Number.isFinite(input.highSchoolGraduatePercent) ||
    input.highSchoolGraduatePercent < 0 ||
    input.highSchoolGraduatePercent > 100
  )
    simpleError(
      "highSchoolGraduatePercent",
      "The high-school-graduate share must be between zero and one hundred percent.",
      "invalid_value",
    );
  const socioeconomicIndex =
    0.59 * input.highIncomePercent + 0.55 * input.highSchoolGraduatePercent - 6;
  if (socioeconomicIndex < 0 || socioeconomicIndex > 96)
    simpleError(
      "highIncomePercent",
      "This combination falls outside the historical Duncan SEI score range of zero to ninety-six.",
      "outside_model_range",
    );
  return {
    socioeconomicIndex,
  };
};

export const duncanSeiSocioeconomicIndexTool = createSimpleTool({
  calculate: (input) =>
    calculateDuncanSei({
      highIncomePercent: input.highIncomePercent as number,
      highSchoolGraduatePercent: input.highSchoolGraduatePercent as number,
    }),
  description:
    "Apply Duncan's 1961 regression to an occupation's high-income and high-school-graduate percentages to estimate its historical socioeconomic index score.",
  id: "sociology/duncan-sei-socioeconomic-index",
  inputs: [
    {
      description:
        "Percentage of male incumbents in the occupation who were high-school graduates in the historical 1950 Census definition.",
      id: "highSchoolGraduatePercent",
      kind: "number",
      label: "High-school graduates",
      maximum: 100,
      minimum: 0,
    },
    {
      description:
        "Percentage of male incumbents in the occupation earning at least $3,500 in 1949 under the historical definition.",
      id: "highIncomePercent",
      kind: "number",
      label: "High-income incumbents",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Historical Duncan estimate: 0.59 times the income percentage plus 0.55 times the education percentage minus 6.",
      id: "socioeconomicIndex",
      kind: "number",
      label: "SEI",
    },
  ],
  title: "Duncan SEI Socioeconomic Index Calculator",
});
export const runDuncanSeiSocioeconomicIndex =
  duncanSeiSocioeconomicIndexTool.execute;
export default duncanSeiSocioeconomicIndexTool;
