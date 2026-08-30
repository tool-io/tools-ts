import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PreferredReturnInput = Readonly<{
  readonly contributedCapital: number;
  readonly annualRatePercent: number;
  readonly yearsOutstanding: number;
}>;
export type PreferredReturnOutput = Readonly<{
  readonly accruedReturn: number;
}>;

export const calculatePreferredReturn = (
  x: PreferredReturnInput,
): PreferredReturnOutput => {
  if (!Number.isFinite(x.contributedCapital) || x.contributedCapital < 0)
    simpleError("contributedCapital", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.annualRatePercent) || x.annualRatePercent < 0)
    simpleError("annualRatePercent", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.yearsOutstanding) || x.yearsOutstanding < 0)
    simpleError("yearsOutstanding", "Provide a finite nonnegative number.");
  const accruedReturn =
    (x.contributedCapital * x.annualRatePercent * x.yearsOutstanding) / 100;
  if (!Number.isFinite(accruedReturn))
    simpleError(
      "accruedReturn",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { accruedReturn: Object.is(accruedReturn, -0) ? 0 : accruedReturn };
};

export const example = {
  input: {
    contributedCapital: 100000,
    annualRatePercent: 8,
    yearsOutstanding: 1,
  },
  output: { accruedReturn: 8000 },
} satisfies ToolExample<PreferredReturnInput, PreferredReturnOutput>;

export const tool = createSimpleTool({
  id: "real-estate/preferred-return",
  title: "Preferred Return",
  description:
    "Simple, noncompounded preferred-return accrual from contributed capital, annual rate and years outstanding.",
  inputs: [
    {
      id: "contributedCapital",
      kind: "number",
      label: "Contributed Capital",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "annualRatePercent",
      kind: "number",
      label: "Annual Rate Percent",
      unit: "percent",
      minimum: 0,
    },
    {
      id: "yearsOutstanding",
      kind: "number",
      label: "Years Outstanding",
      unit: "year",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "accruedReturn",
      kind: "number",
      label: "Accrued Return",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculatePreferredReturn({
      contributedCapital: input.contributedCapital as number,
      annualRatePercent: input.annualRatePercent as number,
      yearsOutstanding: input.yearsOutstanding as number,
    }),
});
export const preferredReturnTool = tool;
export const runPreferredReturn = tool.execute;
export default tool;
