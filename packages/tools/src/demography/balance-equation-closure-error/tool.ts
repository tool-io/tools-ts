import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BalanceEquationClosureErrorInput = {
  readonly populationAtStart: number;
  readonly populationAtEnd: number;
  readonly births: number;
  readonly deaths: number;
  readonly immigrants: number;
  readonly emigrants: number;
};

export type BalanceEquationClosureErrorOutput = {
  readonly expectedFinalPopulation: number;
  readonly closureError: number;
  readonly closureErrorPercent: number;
};

export const calculateBalanceEquationClosureError = (
  input: BalanceEquationClosureErrorInput,
): BalanceEquationClosureErrorOutput => {
  if (!(input.populationAtStart > 0))
    simpleError(
      "populationAtStart",
      "The starting population must be greater than zero.",
      "invalid_population",
    );
  if (!(
    typeof input.populationAtEnd === "number" &&
    Number.isFinite(input.populationAtEnd) &&
    input.populationAtEnd >= 0
  ))
    simpleError(
      "populationAtEnd",
      "The ending population must be finite and non-negative.",
      "invalid_population",
    );
  for (const key of ["births", "deaths", "immigrants", "emigrants"] as const)
    if (!(
      typeof input[key] === "number" &&
      Number.isFinite(input[key]) &&
      input[key] >= 0
    ))
      simpleError(
        key,
        "Vital event and migration counts must be finite and non-negative.",
        "invalid_flow",
      );
  const expectedFinalPopulation =
    input.populationAtStart +
    input.births -
    input.deaths +
    input.immigrants -
    input.emigrants;
  if (!(expectedFinalPopulation > 0))
    simpleError(
      "deaths",
      "The balancing equation yields a non-positive expected final population.",
      "invalid_population",
    );
  const closureError = input.populationAtEnd - expectedFinalPopulation;
  return {
    expectedFinalPopulation,
    closureError,
    closureErrorPercent: (closureError / expectedFinalPopulation) * 100,
  };
};

export const balanceEquationClosureErrorExample = {
  input: {
    populationAtStart: 1000,
    populationAtEnd: 1035,
    births: 30,
    deaths: 10,
    immigrants: 15,
    emigrants: 5,
  },
  output: {
    expectedFinalPopulation: 1030,
    closureError: 5,
    closureErrorPercent: 0.48543689320388345,
  },
} satisfies ToolExample<
  BalanceEquationClosureErrorInput,
  BalanceEquationClosureErrorOutput
>;

export const balanceEquationClosureErrorTool = createSimpleTool({
  id: "demography/balance-equation-closure-error",
  title: "Balance Equation Closure Error",
  description:
    "Close the demographic balancing equation P2 = P1 + births - deaths + immigrants - emigrants and report the absolute and percent discrepancy of the observed end population against the expected value.",
  inputs: [
    {
      description: "Population at the beginning of the period.",
      id: "populationAtStart",
      kind: "number",
      label: "P1",
      minimum: 0,
    },
    {
      description: "Observed population at the end of the period.",
      id: "populationAtEnd",
      kind: "number",
      label: "P2 observed",
      minimum: 0,
    },
    {
      description: "Births registered during the period.",
      id: "births",
      kind: "number",
      label: "Births",
      minimum: 0,
    },
    {
      description: "Deaths registered during the period.",
      id: "deaths",
      kind: "number",
      label: "Deaths",
      minimum: 0,
    },
    {
      description: "In-migrants during the period.",
      id: "immigrants",
      kind: "number",
      label: "Immigrants",
      minimum: 0,
    },
    {
      description: "Out-migrants during the period.",
      id: "emigrants",
      kind: "number",
      label: "Emigrants",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Expected end population from the balancing equation.",
      id: "expectedFinalPopulation",
      kind: "number",
      label: "P2 expected",
    },
    {
      description: "Observed minus expected end population.",
      id: "closureError",
      kind: "number",
      label: "Closure error",
    },
    {
      description: "Closure error as a percent of the expected end population.",
      id: "closureErrorPercent",
      kind: "number",
      label: "Closure error %",
    },
  ],
  calculate: (input) =>
    calculateBalanceEquationClosureError(
      input as unknown as BalanceEquationClosureErrorInput,
    ),
});

export const runBalanceEquationClosureError =
  balanceEquationClosureErrorTool.execute;
export default balanceEquationClosureErrorTool;
