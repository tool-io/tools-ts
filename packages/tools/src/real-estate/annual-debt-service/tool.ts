import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnnualDebtServiceInput = Readonly<{
  readonly monthlyPayment: number;
}>;
export type AnnualDebtServiceOutput = Readonly<{
  readonly annualDebtService: number;
}>;

export const calculateAnnualDebtService = (
  x: AnnualDebtServiceInput,
): AnnualDebtServiceOutput => {
  if (!Number.isFinite(x.monthlyPayment) || x.monthlyPayment < 0)
    simpleError("monthlyPayment", "Provide a finite nonnegative number.");
  const annualDebtService = 12 * x.monthlyPayment;
  if (!Number.isFinite(annualDebtService))
    simpleError(
      "annualDebtService",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    annualDebtService: Object.is(annualDebtService, -0) ? 0 : annualDebtService,
  };
};

export const example = {
  input: {
    monthlyPayment: 2000,
  },
  output: { annualDebtService: 24000 },
} satisfies ToolExample<AnnualDebtServiceInput, AnnualDebtServiceOutput>;

export const tool = createSimpleTool({
  id: "real-estate/annual-debt-service",
  title: "Annual Debt Service",
  description:
    "Total scheduled annual debt payments from a constant monthly payment.",
  inputs: [
    {
      id: "monthlyPayment",
      kind: "number",
      label: "Monthly Payment",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "annualDebtService",
      kind: "number",
      label: "Annual Debt Service",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateAnnualDebtService({
      monthlyPayment: input.monthlyPayment as number,
    }),
});
export const annualDebtServiceTool = tool;
export const runAnnualDebtService = tool.execute;
export default tool;
