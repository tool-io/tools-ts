import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GrossPotentialIncomeInput = Readonly<{
  readonly monthlyRentPerUnit: number;
  readonly unitCount: number;
}>;
export type GrossPotentialIncomeOutput = Readonly<{
  readonly annualPotentialIncome: number;
}>;

export const calculateGrossPotentialIncome = (
  x: GrossPotentialIncomeInput,
): GrossPotentialIncomeOutput => {
  if (!Number.isFinite(x.monthlyRentPerUnit) || x.monthlyRentPerUnit < 0)
    simpleError("monthlyRentPerUnit", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.unitCount) || x.unitCount < 0)
    simpleError("unitCount", "Provide a finite nonnegative number.");
  if (!Number.isInteger(x.unitCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const annualPotentialIncome = 12 * x.monthlyRentPerUnit * x.unitCount;
  if (!Number.isFinite(annualPotentialIncome))
    simpleError(
      "annualPotentialIncome",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    annualPotentialIncome: Object.is(annualPotentialIncome, -0)
      ? 0
      : annualPotentialIncome,
  };
};

export const example = {
  input: {
    monthlyRentPerUnit: 1000,
    unitCount: 10,
  },
  output: { annualPotentialIncome: 120000 },
} satisfies ToolExample<GrossPotentialIncomeInput, GrossPotentialIncomeOutput>;

export const tool = createSimpleTool({
  id: "real-estate/gross-potential-income",
  title: "Gross Potential Income",
  description:
    "Annual gross potential rent at full occupancy from monthly rent per unit and unit count.",
  inputs: [
    {
      id: "monthlyRentPerUnit",
      kind: "number",
      label: "Monthly Rent Per Unit",
      unit: "currency",
      minimum: 0,
    },
    { id: "unitCount", kind: "number", label: "Unit Count", minimum: 0 },
  ],
  outputs: [
    {
      id: "annualPotentialIncome",
      kind: "number",
      label: "Annual Potential Income",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateGrossPotentialIncome({
      monthlyRentPerUnit: input.monthlyRentPerUnit as number,
      unitCount: input.unitCount as number,
    }),
});
export const grossPotentialIncomeTool = tool;
export const runGrossPotentialIncome = tool.execute;
export default tool;
