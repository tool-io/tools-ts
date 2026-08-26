import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CompletedCohortFertilityCffInput = {
  readonly asfrByAge: readonly number[];
  readonly classWidth?: number;
};

export type CompletedCohortFertilityCffOutput = {
  readonly completedFertilityPerWoman: number;
};

export const calculateCompletedCohortFertilityCff = (
  input: CompletedCohortFertilityCffInput,
): CompletedCohortFertilityCffOutput => {
  const classWidth = input.classWidth ?? 1;
  if (!(classWidth > 0))
    simpleError(
      "classWidth",
      "The age-class width must be greater than zero.",
      "invalid_interval",
    );
  if (input.asfrByAge.length === 0)
    simpleError(
      "asfrByAge",
      "Provide at least one age-specific fertility rate.",
      "invalid_list",
    );
  let total = 0;
  for (const rate of input.asfrByAge) {
    if (!(typeof rate === "number" && Number.isFinite(rate) && rate >= 0))
      simpleError(
        "asfrByAge",
        "Fertility rates must be finite and non-negative.",
        "invalid_list",
      );
    total += classWidth * rate;
  }
  return { completedFertilityPerWoman: total };
};

export const completedCohortFertilityCffExample = {
  input: { asfrByAge: [0, 0.05, 0.12, 0.08, 0.02], classWidth: 1 },
  output: { completedFertilityPerWoman: 0.27 },
} satisfies ToolExample<
  CompletedCohortFertilityCffInput,
  CompletedCohortFertilityCffOutput
>;

export const completedCohortFertilityCffTool = createSimpleTool({
  id: "demography/completed-cohort-fertility-cff",
  title: "Completed Cohort Fertility CFF Calculator",
  description:
    "Sum age-specific cohort fertility rates over the reproductive years, scaled by the class width, to obtain children ever born per woman at the end of childbearing.",
  inputs: [
    {
      description:
        "Age-specific fertility rates of the cohort, per woman per year.",
      id: "asfrByAge",
      kind: "numberList",
      label: "ASFR",
    },
    {
      default: 1,
      description: "Width of each age class in years.",
      id: "classWidth",
      kind: "number",
      label: "Class width",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Children born per woman by the end of the reproductive period.",
      id: "completedFertilityPerWoman",
      kind: "number",
      label: "CFF",
    },
  ],
  calculate: (input) =>
    calculateCompletedCohortFertilityCff(
      input as unknown as CompletedCohortFertilityCffInput,
    ),
});

export const runCompletedCohortFertilityCff =
  completedCohortFertilityCffTool.execute;
export default completedCohortFertilityCffTool;
