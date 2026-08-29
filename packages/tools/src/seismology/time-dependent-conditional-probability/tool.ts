import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const timeDependentConditionalProbabilityExample = {
  input: {
    meanIntervalYears: 150,
    stdDevYears: 60,
    elapsedYears: 140,
    forecastWindowYears: 30,
  },
  output: {
    conditionalProbability: 0.6228322825943254,
    hazardRatioVsPoisson: 3.4359511785375663,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const timeDependentConditionalProbabilityTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({
      meanIntervalYears,
      stdDevYears,
      elapsedYears,
      forecastWindowYears,
    }) => {
      if (meanIntervalYears <= 0 || stdDevYears <= 0)
        simpleError("meanIntervalYears", "Mean and sigma must be positive.");
      if (!(forecastWindowYears > 0))
        simpleError("forecastWindowYears", "Forecast window must be positive.");
      const k = Math.pow(meanIntervalYears / stdDevYears, 2);
      const C = [
        0.99999999999980993, 676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059, 12.507343278686905,
        -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
      ];
      const gammaFn = (z: number): number => {
        if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaFn(1 - z));
        const x = z - 1;
        let a = C[0];
        const t = x + 7.5;
        for (let i = 1; i < 9; i++) a += C[i] / (x + i);
        return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
      };
      const lam = meanIntervalYears / gammaFn(1 + 1 / k);
      const cumulativeHazardAtStart = Math.pow(elapsedYears / lam, k);
      const cumulativeHazardAtEnd = Math.pow(
        (elapsedYears + forecastWindowYears) / lam,
        k,
      );
      const pCond =
        1 - Math.exp(-(cumulativeHazardAtEnd - cumulativeHazardAtStart));
      const pPoisson = 1 - Math.exp(-forecastWindowYears / meanIntervalYears);
      return {
        conditionalProbability: pCond,
        hazardRatioVsPoisson: pCond / pPoisson,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Approximate time-dependent rupture probability from a Weibull renewal model, using k = (mean/std. dev.)² and a scale chosen to preserve the supplied mean; this is not a Brownian-passage-time calculation.",
  id: "seismology/time-dependent-conditional-probability",
  inputs: [
    {
      minimum: 0,
      description: "Mean recurrence interval.",
      id: "meanIntervalYears",
      kind: "number",
      label: "μ",
      unit: "yr",
    },
    {
      minimum: 0,
      description: "Recurrence scatter.",
      id: "stdDevYears",
      kind: "number",
      label: "σ",
      unit: "yr",
    },
    {
      minimum: 0,
      description: "Time since last event.",
      id: "elapsedYears",
      kind: "number",
      label: "te",
      unit: "yr",
    },
    {
      minimum: 0,
      description: "Forecast horizon.",
      id: "forecastWindowYears",
      kind: "number",
      label: "Δt",
      unit: "yr",
    },
  ],
  outputs: [
    {
      description: "Conditional probability over the window.",
      id: "conditionalProbability",
      kind: "number",
      label: "P(te,Δt)",
    },
    {
      description: "Conditional vs Poisson hazard ratio.",
      id: "hazardRatioVsPoisson",
      kind: "number",
      label: "R/P",
    },
  ],
  title: "Time Dependent Conditional Probability Calculator",
});
export const runTimeDependentConditionalProbability =
  timeDependentConditionalProbabilityTool.execute;
export { timeDependentConditionalProbabilityExample as example };
export default timeDependentConditionalProbabilityTool;
