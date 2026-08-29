import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BermudanOptionInput = {
  readonly dividendYieldPercent: number;
  readonly exerciseSteps: readonly number[];
  readonly optionType: "call" | "put";
  readonly riskFreeRatePercent: number;
  readonly spotPrice: number;
  readonly steps: number;
  readonly strikePrice: number;
  readonly timeToExpirationYears: number;
  readonly volatilityPercent: number;
};
export type BermudanOptionOutput = {
  readonly allowedEarlyExerciseDates: number;
  readonly optionPrice: number;
};

const payoff = (type: "call" | "put", spot: number, strike: number) =>
  Math.max(type === "call" ? spot - strike : strike - spot, 0);

export const calculateBermudanOption = (
  input: BermudanOptionInput,
): BermudanOptionOutput => {
  if (!(input.spotPrice > 0) || !(input.strikePrice > 0))
    simpleError(
      "spotPrice",
      "Spot and strike prices must be greater than zero.",
    );
  if (!(input.timeToExpirationYears > 0) || !(input.volatilityPercent > 0))
    simpleError(
      "timeToExpirationYears",
      "Time and volatility must be greater than zero.",
    );
  if (
    !Number.isSafeInteger(input.steps) ||
    input.steps < 2 ||
    input.steps > 2_000
  )
    simpleError("steps", "Tree steps must be a whole number from 2 to 2,000.");
  if (
    input.exerciseSteps.some(
      (step) => !Number.isSafeInteger(step) || step < 1 || step >= input.steps,
    )
  )
    simpleError(
      "exerciseSteps",
      "Each early-exercise step must be a whole number from 1 through steps minus 1.",
    );
  const exerciseSteps = new Set(input.exerciseSteps);
  const timeStep = input.timeToExpirationYears / input.steps;
  const rate = input.riskFreeRatePercent / 100;
  const yieldRate = input.dividendYieldPercent / 100;
  const up = Math.exp((input.volatilityPercent / 100) * Math.sqrt(timeStep));
  const down = 1 / up;
  const probability =
    (Math.exp((rate - yieldRate) * timeStep) - down) / (up - down);
  if (!(probability >= 0 && probability <= 1))
    simpleError(
      "steps",
      "Increase the step count to obtain a valid risk-neutral probability.",
      "invalid_probability",
    );
  const discount = Math.exp(-rate * timeStep);
  const values = Array.from({ length: input.steps + 1 }, (_, upMoves) =>
    payoff(
      input.optionType,
      input.spotPrice * up ** upMoves * down ** (input.steps - upMoves),
      input.strikePrice,
    ),
  );
  for (let step = input.steps - 1; step >= 0; step -= 1) {
    for (let upMoves = 0; upMoves <= step; upMoves += 1) {
      const continuation =
        discount *
        (probability * values[upMoves + 1]! +
          (1 - probability) * values[upMoves]!);
      values[upMoves] = exerciseSteps.has(step)
        ? Math.max(
            continuation,
            payoff(
              input.optionType,
              input.spotPrice * up ** upMoves * down ** (step - upMoves),
              input.strikePrice,
            ),
          )
        : continuation;
    }
  }
  return {
    allowedEarlyExerciseDates: exerciseSteps.size,
    optionPrice: values[0]!,
  };
};

const exampleInput: BermudanOptionInput = {
  dividendYieldPercent: 0,
  exerciseSteps: [25, 50, 75],
  optionType: "put",
  riskFreeRatePercent: 5,
  spotPrice: 100,
  steps: 100,
  strikePrice: 100,
  timeToExpirationYears: 1,
  volatilityPercent: 20,
};
export const bermudanOptionExample = {
  input: exampleInput,
  output: calculateBermudanOption(exampleInput),
} satisfies ToolExample<BermudanOptionInput, BermudanOptionOutput>;

export const bermudanOptionTool = createSimpleTool({
  calculate: (input) =>
    calculateBermudanOption({
      dividendYieldPercent: input.dividendYieldPercent as number,
      exerciseSteps: input.exerciseSteps as number[],
      optionType: input.optionType as "call" | "put",
      riskFreeRatePercent: input.riskFreeRatePercent as number,
      spotPrice: input.spotPrice as number,
      steps: input.steps as number,
      strikePrice: input.strikePrice as number,
      timeToExpirationYears: input.timeToExpirationYears as number,
      volatilityPercent: input.volatilityPercent as number,
    }),
  description:
    "Estimate a Bermudan call or put with a Cox-Ross-Rubinstein tree, allowing early exercise only at selected tree steps plus expiration; results depend on the exercise schedule and discretization.",
  id: "finance/bermudan-option-binomial",
  inputs: [
    { id: "spotPrice", kind: "number", label: "Spot price", minimum: 0 },
    { id: "strikePrice", kind: "number", label: "Strike price", minimum: 0 },
    {
      id: "timeToExpirationYears",
      kind: "number",
      label: "Time to expiration",
      minimum: 0,
      unit: "years",
    },
    {
      id: "riskFreeRatePercent",
      kind: "number",
      label: "Risk-free rate",
      unit: "%",
    },
    {
      id: "dividendYieldPercent",
      kind: "number",
      label: "Dividend yield",
      unit: "%",
    },
    {
      id: "volatilityPercent",
      kind: "number",
      label: "Annualized volatility",
      minimum: 0,
      unit: "%",
    },
    {
      enum: ["call", "put"],
      id: "optionType",
      kind: "string",
      label: "Option type",
    },
    {
      id: "steps",
      kind: "integer",
      label: "Tree steps",
      maximum: 2_000,
      minimum: 2,
    },
    { id: "exerciseSteps", kind: "numberList", label: "Early-exercise steps" },
  ],
  outputs: [
    { id: "optionPrice", kind: "number", label: "Bermudan option price" },
    {
      id: "allowedEarlyExerciseDates",
      kind: "integer",
      label: "Allowed early-exercise dates",
    },
  ],
  title: "Bermudan Option Binomial Calculator",
});
export const runBermudanOption = bermudanOptionTool.execute;
export default bermudanOptionTool;
