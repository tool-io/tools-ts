import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const eventCountPoissonConfidenceIntervalGehrelsExample = {
  input: { observedCount: 4 },
  output: {
    lowerBound: 2.0909636488340193,
    upperBound: 7.23606797749979,
    approximation: "Gehrels one-sigma algebraic approximation",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const eventCountPoissonConfidenceIntervalGehrelsTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ observedCount }) => {
      const N = observedCount;
      if (N === 0)
        return {
          lowerBound: 0,
          upperBound: 1.841,
          approximation: "zero-count rule: lambda_hi = 1.841 at one sigma",
        };
      const lower = N * Math.pow(1 - 1 / (9 * N) - 1 / (3 * Math.sqrt(N)), 3);
      const upper = N + Math.sqrt(N + 1) + 1;
      return {
        lowerBound: Math.max(0, lower),
        upperBound: upper,
        approximation: "Gehrels one-sigma algebraic approximation",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Gehrels (1986) algebraic approximations to the 84.13% one-sided Poisson limits (the conventional asymmetric one-sigma error bars), including the tabulated 1.841 upper limit for zero counts.",
  id: "seismology/event-count-poisson-confidence-interval-gehrels",
  inputs: [
    {
      minimum: 0,
      description: "Observed event count.",
      id: "observedCount",
      kind: "integer",
      label: "N",
    },
  ],
  outputs: [
    {
      description: "One-sigma lower limit.",
      id: "lowerBound",
      kind: "number",
      label: "λ_lo",
    },
    {
      description: "One-sigma upper limit.",
      id: "upperBound",
      kind: "number",
      label: "λ_hi",
    },
    {
      description: "Which Gehrels rule was applied.",
      id: "approximation",
      kind: "string",
      label: "Rule",
    },
  ],
  title: "Event Count Poisson Confidence Interval Gehrels Approximation",
});
export const runEventCountPoissonConfidenceIntervalGehrels =
  eventCountPoissonConfidenceIntervalGehrelsTool.execute;
export { eventCountPoissonConfidenceIntervalGehrelsExample as example };
export default eventCountPoissonConfidenceIntervalGehrelsTool;
