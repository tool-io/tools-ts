import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AmericanOptionInput = {
  readonly dividendYieldPercent: number;
  readonly optionType: "call" | "put";
  readonly riskFreeRatePercent: number;
  readonly spotPrice: number;
  readonly steps: number;
  readonly strikePrice: number;
  readonly timeToExpirationYears: number;
  readonly volatilityPercent: number;
};

export type AmericanOptionOutput = {
  readonly americanPrice: number;
  readonly earlyExercisePremium: number;
  readonly europeanBinomialPrice: number;
};

const payoff = (type: "call" | "put", spot: number, strike: number) =>
  Math.max(type === "call" ? spot - strike : strike - spot, 0);

export const calculateAmericanOption = (
  input: AmericanOptionInput,
): AmericanOptionOutput => {
  if (!(input.spotPrice > 0) || !(input.strikePrice > 0))
    simpleError(
      "spotPrice",
      "Spot and strike prices must be greater than zero.",
    );
  if (!(input.timeToExpirationYears > 0) || !(input.volatilityPercent > 0))
    simpleError(
      "timeToExpirationYears",
      "Time to expiration and volatility must be greater than zero.",
    );
  if (
    !Number.isSafeInteger(input.steps) ||
    input.steps < 1 ||
    input.steps > 2_000
  )
    simpleError("steps", "Tree steps must be a whole number from 1 to 2,000.");
  const timeStep = input.timeToExpirationYears / input.steps;
  const volatility = input.volatilityPercent / 100;
  const riskFreeRate = input.riskFreeRatePercent / 100;
  const dividendYield = input.dividendYieldPercent / 100;
  const up = Math.exp(volatility * Math.sqrt(timeStep));
  const down = 1 / up;
  const probability =
    (Math.exp((riskFreeRate - dividendYield) * timeStep) - down) / (up - down);
  if (!(probability >= 0 && probability <= 1))
    simpleError(
      "steps",
      "The selected steps produce an invalid risk-neutral probability; increase the step count.",
      "invalid_probability",
    );
  const discount = Math.exp(-riskFreeRate * timeStep);
  const american = Array.from({ length: input.steps + 1 }, (_, upMoves) =>
    payoff(
      input.optionType,
      input.spotPrice * up ** upMoves * down ** (input.steps - upMoves),
      input.strikePrice,
    ),
  );
  const european = [...american];
  for (let step = input.steps - 1; step >= 0; step -= 1) {
    for (let upMoves = 0; upMoves <= step; upMoves += 1) {
      const continuation =
        discount *
        (probability * american[upMoves + 1]! +
          (1 - probability) * american[upMoves]!);
      const spot = input.spotPrice * up ** upMoves * down ** (step - upMoves);
      american[upMoves] = Math.max(
        continuation,
        payoff(input.optionType, spot, input.strikePrice),
      );
      european[upMoves] =
        discount *
        (probability * european[upMoves + 1]! +
          (1 - probability) * european[upMoves]!);
    }
  }
  return {
    americanPrice: american[0]!,
    earlyExercisePremium: Math.max(american[0]! - european[0]!, 0),
    europeanBinomialPrice: european[0]!,
  };
};

const exampleInput: AmericanOptionInput = {
  dividendYieldPercent: 0,
  optionType: "put",
  riskFreeRatePercent: 5,
  spotPrice: 100,
  steps: 100,
  strikePrice: 100,
  timeToExpirationYears: 1,
  volatilityPercent: 20,
};

export const americanOptionExample = {
  input: exampleInput,
  output: calculateAmericanOption(exampleInput),
} satisfies ToolExample<AmericanOptionInput, AmericanOptionOutput>;

export const americanOptionTool = createSimpleTool({
  calculate: (input) =>
    calculateAmericanOption({
      dividendYieldPercent: input.dividendYieldPercent as number,
      optionType: input.optionType as "call" | "put",
      riskFreeRatePercent: input.riskFreeRatePercent as number,
      spotPrice: input.spotPrice as number,
      steps: input.steps as number,
      strikePrice: input.strikePrice as number,
      timeToExpirationYears: input.timeToExpirationYears as number,
      volatilityPercent: input.volatilityPercent as number,
    }),
  description:
    "Estimate an American call or put with a Cox-Ross-Rubinstein binomial tree and report the premium over the same tree without early exercise; convergence depends on the chosen step count.",
  id: "finance/american-option-binomial",
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
      minimum: 1,
    },
  ],
  outputs: [
    { id: "americanPrice", kind: "number", label: "American option price" },
    {
      id: "europeanBinomialPrice",
      kind: "number",
      label: "European binomial price",
    },
    {
      id: "earlyExercisePremium",
      kind: "number",
      label: "Early-exercise premium",
    },
  ],
  title: "American Option Binomial Calculator",
});

export const runAmericanOption = americanOptionTool.execute;
export default americanOptionTool;
