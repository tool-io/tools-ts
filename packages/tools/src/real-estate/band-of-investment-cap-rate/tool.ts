import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BandOfInvestmentCapRateInput = Readonly<{
  readonly debtFraction: number;
  readonly mortgageConstantPercent: number;
  readonly equityYieldPercent: number;
}>;
export type BandOfInvestmentCapRateOutput = Readonly<{
  readonly estimatedCapRatePercent: number;
}>;

export const calculateBandOfInvestmentCapRate = (
  x: BandOfInvestmentCapRateInput,
): BandOfInvestmentCapRateOutput => {
  if (!Number.isFinite(x.debtFraction) || x.debtFraction < 0)
    simpleError("debtFraction", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.mortgageConstantPercent) ||
    x.mortgageConstantPercent < 0
  )
    simpleError(
      "mortgageConstantPercent",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.equityYieldPercent) || x.equityYieldPercent < 0)
    simpleError("equityYieldPercent", "Provide a finite nonnegative number.");
  if (!(x.debtFraction <= 1))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const estimatedCapRatePercent =
    x.debtFraction * x.mortgageConstantPercent +
    (1 - x.debtFraction) * x.equityYieldPercent;
  if (!Number.isFinite(estimatedCapRatePercent))
    simpleError(
      "estimatedCapRatePercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    estimatedCapRatePercent: Object.is(estimatedCapRatePercent, -0)
      ? 0
      : estimatedCapRatePercent,
  };
};

export const example = {
  input: {
    debtFraction: 0.7,
    mortgageConstantPercent: 7,
    equityYieldPercent: 10,
  },
  output: { estimatedCapRatePercent: 7.9 },
} satisfies ToolExample<
  BandOfInvestmentCapRateInput,
  BandOfInvestmentCapRateOutput
>;

export const tool = createSimpleTool({
  id: "real-estate/band-of-investment-cap-rate",
  title: "Band Of Investment Cap Rate",
  description:
    "Weighted cap-rate estimate from debt/equity financing shares and required debt/equity yields.",
  inputs: [
    { id: "debtFraction", kind: "number", label: "Debt Fraction", minimum: 0 },
    {
      id: "mortgageConstantPercent",
      kind: "number",
      label: "Mortgage Constant Percent",
      unit: "percent",
      minimum: 0,
    },
    {
      id: "equityYieldPercent",
      kind: "number",
      label: "Equity Yield Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "estimatedCapRatePercent",
      kind: "number",
      label: "Estimated Cap Rate Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateBandOfInvestmentCapRate({
      debtFraction: input.debtFraction as number,
      mortgageConstantPercent: input.mortgageConstantPercent as number,
      equityYieldPercent: input.equityYieldPercent as number,
    }),
});
export const bandOfInvestmentCapRateTool = tool;
export const runBandOfInvestmentCapRate = tool.execute;
export default tool;
