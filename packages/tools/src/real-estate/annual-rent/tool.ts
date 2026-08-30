import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnnualRentInput = Readonly<{
  readonly monthlyRent: number;
}>;
export type AnnualRentOutput = Readonly<{
  readonly annualRent: number;
}>;

export const calculateAnnualRent = (x: AnnualRentInput): AnnualRentOutput => {
  if (!Number.isFinite(x.monthlyRent) || x.monthlyRent < 0)
    simpleError("monthlyRent", "Provide a finite nonnegative number.");
  const annualRent = 12 * x.monthlyRent;
  if (!Number.isFinite(annualRent))
    simpleError(
      "annualRent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { annualRent: Object.is(annualRent, -0) ? 0 : annualRent };
};

export const example = {
  input: {
    monthlyRent: 1500,
  },
  output: { annualRent: 18000 },
} satisfies ToolExample<AnnualRentInput, AnnualRentOutput>;

export const tool = createSimpleTool({
  id: "real-estate/annual-rent",
  title: "Annual Rent",
  description:
    "Annual rent from a constant monthly rent amount; ignores scheduled increases and vacancies.",
  inputs: [
    {
      id: "monthlyRent",
      kind: "number",
      label: "Monthly Rent",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "annualRent",
      kind: "number",
      label: "Annual Rent",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateAnnualRent({
      monthlyRent: input.monthlyRent as number,
    }),
});
export const annualRentTool = tool;
export const runAnnualRent = tool.execute;
export default tool;
