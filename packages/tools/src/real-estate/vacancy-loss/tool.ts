import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VacancyLossInput = Readonly<{
  readonly grossPotentialRent: number;
  readonly vacancyPercent: number;
}>;
export type VacancyLossOutput = Readonly<{
  readonly vacancyLoss: number;
}>;

export const calculateVacancyLoss = (
  x: VacancyLossInput,
): VacancyLossOutput => {
  if (!Number.isFinite(x.grossPotentialRent) || x.grossPotentialRent < 0)
    simpleError("grossPotentialRent", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.vacancyPercent) || x.vacancyPercent < 0)
    simpleError("vacancyPercent", "Provide a finite nonnegative number.");
  if (!(x.vacancyPercent <= 100))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const vacancyLoss = (x.grossPotentialRent * x.vacancyPercent) / 100;
  if (!Number.isFinite(vacancyLoss))
    simpleError(
      "vacancyLoss",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { vacancyLoss: Object.is(vacancyLoss, -0) ? 0 : vacancyLoss };
};

export const example = {
  input: {
    grossPotentialRent: 120000,
    vacancyPercent: 5,
  },
  output: { vacancyLoss: 6000 },
} satisfies ToolExample<VacancyLossInput, VacancyLossOutput>;

export const tool = createSimpleTool({
  id: "real-estate/vacancy-loss",
  title: "Vacancy Loss",
  description:
    "Expected rent lost to vacancy from gross potential rent and a supplied vacancy percentage.",
  inputs: [
    {
      id: "grossPotentialRent",
      kind: "number",
      label: "Gross Potential Rent",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "vacancyPercent",
      kind: "number",
      label: "Vacancy Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "vacancyLoss",
      kind: "number",
      label: "Vacancy Loss",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateVacancyLoss({
      grossPotentialRent: input.grossPotentialRent as number,
      vacancyPercent: input.vacancyPercent as number,
    }),
});
export const vacancyLossTool = tool;
export const runVacancyLoss = tool.execute;
export default tool;
