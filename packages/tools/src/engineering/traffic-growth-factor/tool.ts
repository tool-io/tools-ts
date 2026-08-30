import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrafficGrowthFactorInput = Readonly<{
  readonly annualGrowthFraction: number;
  readonly years: number;
}>;
export type TrafficGrowthFactorOutput = Readonly<{
  readonly growthFactor: number;
}>;

export const calculateTrafficGrowthFactor = (
  x: TrafficGrowthFactorInput,
): TrafficGrowthFactorOutput => {
  if (!Number.isFinite(x.annualGrowthFraction))
    simpleError("annualGrowthFraction", "Provide a finite number.");
  if (!Number.isFinite(x.years) || x.years < 0)
    simpleError("years", "Provide a finite number at least 0.");
  if (x.annualGrowthFraction <= -1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const growthFactor = (1 + x.annualGrowthFraction) ** x.years;
  if (!Number.isFinite(growthFactor))
    simpleError(
      "growthFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { growthFactor: Object.is(growthFactor, -0) ? 0 : growthFactor };
};

export const example = {
  input: { annualGrowthFraction: 0.02, years: 10 },
  output: { growthFactor: 1.2189944199947573 },
} satisfies ToolExample<TrafficGrowthFactorInput, TrafficGrowthFactorOutput>;

export const tool = createSimpleTool({
  id: "engineering/traffic-growth-factor",
  title: "Traffic Growth Factor",
  description:
    "Compound traffic growth factor (1+r)^years for a constant annual growth fraction r; does not forecast policy or network changes.",
  inputs: [
    {
      id: "annualGrowthFraction",
      kind: "number",
      label: "Annual Growth Fraction",
    },
    { id: "years", kind: "number", label: "Years", unit: "year", minimum: 0 },
  ],
  outputs: [{ id: "growthFactor", kind: "number", label: "Growth Factor" }],
  calculate: (input) =>
    calculateTrafficGrowthFactor({
      annualGrowthFraction: input.annualGrowthFraction as number,
      years: input.years as number,
    }),
});
export const trafficGrowthFactorTool = tool;
export const runTrafficGrowthFactor = tool.execute;
export default tool;
