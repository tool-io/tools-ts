import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const poissonReturnPeriodProbabilityExceedanceExample = {
  input: { returnPeriodYears: 475, exposureYears: 50 },
  output: {
    probabilityPercent: 9.991237374774077,
    annualRate: 0.002105263157894737,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const poissonReturnPeriodProbabilityExceedanceTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ returnPeriodYears, exposureYears }) => {
      if (returnPeriodYears <= 0)
        simpleError("returnPeriodYears", "Return period must be positive.");
      const annualRate = 1 / returnPeriodYears;
      return {
        probabilityPercent: (1 - Math.exp(-annualRate * exposureYears)) * 100,
        annualRate,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Probability of at least one exceedance within T years for a Poisson process: P = 1 − exp(−T/TR).",
  id: "seismology/poisson-return-period-probability-exceedance",
  inputs: [
    {
      minimum: 0,
      description: "Mean return period.",
      id: "returnPeriodYears",
      kind: "number",
      label: "TR",
      unit: "yr",
    },
    {
      minimum: 0,
      description: "Exposure window.",
      id: "exposureYears",
      kind: "number",
      label: "T",
      unit: "yr",
    },
  ],
  outputs: [
    {
      description: "Exceedance probability.",
      id: "probabilityPercent",
      kind: "number",
      label: "P",
      unit: "%",
    },
    {
      description: "Equivalent annual rate.",
      id: "annualRate",
      kind: "number",
      label: "λ",
      unit: "1/yr",
    },
  ],
  title: "Poisson Return Period Probability Exceedance Calculator",
});
export const runPoissonReturnPeriodProbabilityExceedance =
  poissonReturnPeriodProbabilityExceedanceTool.execute;
export { poissonReturnPeriodProbabilityExceedanceExample as example };
export default poissonReturnPeriodProbabilityExceedanceTool;
