import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IntercensalExponentialEstimatorInput = {
  readonly startPopulation: number;
  readonly endPopulation: number;
  readonly intervalYears: number;
  readonly yearsFromStart: number;
};

export type IntercensalExponentialEstimatorOutput = {
  readonly annualGrowthRate: number;
  readonly estimatedPopulation: number;
};

export const calculateIntercensalExponentialEstimator = (
  input: IntercensalExponentialEstimatorInput,
): IntercensalExponentialEstimatorOutput => {
  if (!(input.startPopulation > 0))
    return simpleError(
      "startPopulation",
      "The earlier census population must be greater than zero.",
      "invalid_population",
    );
  if (!(input.endPopulation > 0))
    return simpleError(
      "endPopulation",
      "The later census population must be greater than zero.",
      "invalid_population",
    );
  if (!(input.intervalYears > 0))
    return simpleError(
      "intervalYears",
      "The interval between censuses must be greater than zero years.",
      "invalid_interval",
    );
  if (!(
    input.yearsFromStart >= 0 && input.yearsFromStart <= input.intervalYears
  ))
    return simpleError(
      "yearsFromStart",
      "The elapsed time must lie within the census interval.",
      "invalid_interval",
    );
  const annualGrowthRate =
    Math.log(input.endPopulation / input.startPopulation) / input.intervalYears;
  return {
    annualGrowthRate,
    estimatedPopulation:
      input.startPopulation * Math.exp(annualGrowthRate * input.yearsFromStart),
  };
};

export const intercensalExponentialEstimatorExample = {
  input: {
    startPopulation: 1000000,
    endPopulation: 1500000,
    intervalYears: 10,
    yearsFromStart: 5,
  },
  output: {
    annualGrowthRate: 0.040546510810816436,
    estimatedPopulation: 1224744.871391589,
  },
} satisfies ToolExample<
  IntercensalExponentialEstimatorInput,
  IntercensalExponentialEstimatorOutput
>;

export const intercensalExponentialEstimatorTool = createSimpleTool({
  id: "demography/intercensal-exponential-estimator",
  title: "Intercensal Exponential Estimator",
  description:
    "Fit the exponential growth model P(t) = P0 exp(r t) with r = ln(P1/P0)/n between two censuses and evaluate the population at any time inside the interval.",
  inputs: [
    {
      description: "Population at the earlier census.",
      id: "startPopulation",
      kind: "number",
      label: "P0",
      minimum: 0,
    },
    {
      description: "Population at the later census.",
      id: "endPopulation",
      kind: "number",
      label: "P1",
      minimum: 0,
    },
    {
      description: "Years separating the two censuses.",
      id: "intervalYears",
      kind: "number",
      label: "Interval",
      minimum: 0,
    },
    {
      description: "Years after the earlier census at which to estimate.",
      id: "yearsFromStart",
      kind: "number",
      label: "Elapsed t",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Continuous annual growth rate r per year.",
      id: "annualGrowthRate",
      kind: "number",
      label: "Growth rate",
    },
    {
      description: "Estimated population at the requested time.",
      id: "estimatedPopulation",
      kind: "number",
      label: "Estimate",
    },
  ],
  calculate: (input) =>
    calculateIntercensalExponentialEstimator(
      input as unknown as IntercensalExponentialEstimatorInput,
    ),
});

export const runIntercensalExponentialEstimator =
  intercensalExponentialEstimatorTool.execute;
export default intercensalExponentialEstimatorTool;
