import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VacancyRateInput = Readonly<{
  readonly vacantUnits: number;
  readonly totalUnits: number;
}>;
export type VacancyRateOutput = Readonly<{
  readonly vacancyPercent: number;
}>;

export const calculateVacancyRate = (
  x: VacancyRateInput,
): VacancyRateOutput => {
  if (!Number.isFinite(x.vacantUnits) || x.vacantUnits < 0)
    simpleError("vacantUnits", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.totalUnits) ||
    !Number.isSafeInteger(x.totalUnits) ||
    x.totalUnits < 1
  )
    simpleError("totalUnits", "Provide a positive safe integer.");
  if (!(Number.isInteger(x.vacantUnits) && x.vacantUnits <= x.totalUnits))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const vacancyPercent = (100 * x.vacantUnits) / x.totalUnits;
  if (!Number.isFinite(vacancyPercent))
    simpleError(
      "vacancyPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { vacancyPercent: Object.is(vacancyPercent, -0) ? 0 : vacancyPercent };
};

export const example = {
  input: {
    vacantUnits: 5,
    totalUnits: 100,
  },
  output: { vacancyPercent: 5 },
} satisfies ToolExample<VacancyRateInput, VacancyRateOutput>;

export const tool = createSimpleTool({
  id: "real-estate/vacancy-rate",
  title: "Vacancy Rate",
  description: "Vacant units as a percentage of rentable units at a snapshot.",
  inputs: [
    { id: "vacantUnits", kind: "number", label: "Vacant Units", minimum: 0 },
    { id: "totalUnits", kind: "integer", label: "Total Units", minimum: 1 },
  ],
  outputs: [
    {
      id: "vacancyPercent",
      kind: "number",
      label: "Vacancy Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateVacancyRate({
      vacantUnits: input.vacantUnits as number,
      totalUnits: input.totalUnits as number,
    }),
});
export const vacancyRateTool = tool;
export const runVacancyRate = tool.execute;
export default tool;
