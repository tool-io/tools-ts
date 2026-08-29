import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EuropeanOptionInput = {
  readonly dividendYieldPercent: number;
  readonly optionType: "call" | "put";
  readonly riskFreeRatePercent: number;
  readonly spotPrice: number;
  readonly strikePrice: number;
  readonly timeToExpirationYears: number;
  readonly volatilityPercent: number;
};

export type EuropeanOptionOutput = {
  readonly d1: number;
  readonly d2: number;
  readonly optionPrice: number;
};

const normalCdf = (value: number): number => {
  const absolute = Math.abs(value);
  const t = 1 / (1 + 0.2316419 * absolute);
  const polynomial =
    t *
    (0.31938153 +
      t *
        (-0.356563782 +
          t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const upper =
    1 -
    (Math.exp((-absolute * absolute) / 2) / Math.sqrt(2 * Math.PI)) *
      polynomial;
  return value >= 0 ? upper : 1 - upper;
};

export const calculateEuropeanOption = (
  input: EuropeanOptionInput,
): EuropeanOptionOutput => {
  if (!(input.spotPrice > 0))
    simpleError("spotPrice", "Spot price must be greater than zero.");
  if (!(input.strikePrice > 0))
    simpleError("strikePrice", "Strike price must be greater than zero.");
  if (!(input.timeToExpirationYears > 0))
    simpleError(
      "timeToExpirationYears",
      "Time to expiration must be greater than zero.",
    );
  if (!(input.volatilityPercent > 0))
    simpleError("volatilityPercent", "Volatility must be greater than zero.");
  const time = input.timeToExpirationYears;
  const volatility = input.volatilityPercent / 100;
  const riskFreeRate = input.riskFreeRatePercent / 100;
  const dividendYield = input.dividendYieldPercent / 100;
  const d1 =
    (Math.log(input.spotPrice / input.strikePrice) +
      (riskFreeRate - dividendYield + (volatility * volatility) / 2) * time) /
    (volatility * Math.sqrt(time));
  const d2 = d1 - volatility * Math.sqrt(time);
  const discountedSpot = input.spotPrice * Math.exp(-dividendYield * time);
  const discountedStrike = input.strikePrice * Math.exp(-riskFreeRate * time);
  const optionPrice =
    input.optionType === "call"
      ? discountedSpot * normalCdf(d1) - discountedStrike * normalCdf(d2)
      : discountedStrike * normalCdf(-d2) - discountedSpot * normalCdf(-d1);
  return { d1, d2, optionPrice };
};

const exampleInput: EuropeanOptionInput = {
  dividendYieldPercent: 0,
  optionType: "call",
  riskFreeRatePercent: 5,
  spotPrice: 100,
  strikePrice: 100,
  timeToExpirationYears: 1,
  volatilityPercent: 20,
};

export const europeanOptionExample = {
  input: exampleInput,
  output: calculateEuropeanOption(exampleInput),
} satisfies ToolExample<EuropeanOptionInput, EuropeanOptionOutput>;

export const europeanOptionTool = createSimpleTool({
  calculate: (input) =>
    calculateEuropeanOption({
      dividendYieldPercent: input.dividendYieldPercent as number,
      optionType: input.optionType as "call" | "put",
      riskFreeRatePercent: input.riskFreeRatePercent as number,
      spotPrice: input.spotPrice as number,
      strikePrice: input.strikePrice as number,
      timeToExpirationYears: input.timeToExpirationYears as number,
      volatilityPercent: input.volatilityPercent as number,
    }),
  description:
    "Price a European call or put with the Black-Scholes-Merton model using continuous rates and dividend yield; the model assumes constant volatility and exercise only at expiration.",
  id: "finance/european-option-black-scholes",
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
      label: "Continuously compounded risk-free rate",
      unit: "%",
    },
    {
      id: "dividendYieldPercent",
      kind: "number",
      label: "Continuous dividend yield",
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
  ],
  outputs: [
    { id: "optionPrice", kind: "number", label: "Option price" },
    { id: "d1", kind: "number", label: "d1" },
    { id: "d2", kind: "number", label: "d2" },
  ],
  title: "European Option Black-Scholes Calculator",
});

export const runEuropeanOption = europeanOptionTool.execute;
export default europeanOptionTool;
