import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GeometricAsianOptionInput = {
  readonly dividendYieldPercent: number;
  readonly optionType: "call" | "put";
  readonly riskFreeRatePercent: number;
  readonly spotPrice: number;
  readonly strikePrice: number;
  readonly timeToExpirationYears: number;
  readonly volatilityPercent: number;
};
export type GeometricAsianOptionOutput = {
  readonly expectedDiscountedGeometricAverage: number;
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

export const calculateGeometricAsianOption = (
  input: GeometricAsianOptionInput,
): GeometricAsianOptionOutput => {
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
  const time = input.timeToExpirationYears;
  const volatility = input.volatilityPercent / 100;
  const rate = input.riskFreeRatePercent / 100;
  const yieldRate = input.dividendYieldPercent / 100;
  const logMean =
    Math.log(input.spotPrice) +
    ((rate - yieldRate - volatility ** 2 / 2) * time) / 2;
  const logVariance = (volatility ** 2 * time) / 3;
  const deviation = Math.sqrt(logVariance);
  const d2 = (logMean - Math.log(input.strikePrice)) / deviation;
  const d1 = d2 + deviation;
  const averageExpectation = Math.exp(logMean + logVariance / 2);
  const discount = Math.exp(-rate * time);
  const optionPrice =
    discount *
    (input.optionType === "call"
      ? averageExpectation * normalCdf(d1) - input.strikePrice * normalCdf(d2)
      : input.strikePrice * normalCdf(-d2) -
        averageExpectation * normalCdf(-d1));
  return {
    expectedDiscountedGeometricAverage: discount * averageExpectation,
    optionPrice,
  };
};

const exampleInput: GeometricAsianOptionInput = {
  dividendYieldPercent: 0,
  optionType: "call",
  riskFreeRatePercent: 5,
  spotPrice: 100,
  strikePrice: 100,
  timeToExpirationYears: 1,
  volatilityPercent: 20,
};
export const geometricAsianOptionExample = {
  input: exampleInput,
  output: calculateGeometricAsianOption(exampleInput),
} satisfies ToolExample<GeometricAsianOptionInput, GeometricAsianOptionOutput>;

export const geometricAsianOptionTool = createSimpleTool({
  calculate: (input) =>
    calculateGeometricAsianOption({
      dividendYieldPercent: input.dividendYieldPercent as number,
      optionType: input.optionType as "call" | "put",
      riskFreeRatePercent: input.riskFreeRatePercent as number,
      spotPrice: input.spotPrice as number,
      strikePrice: input.strikePrice as number,
      timeToExpirationYears: input.timeToExpirationYears as number,
      volatilityPercent: input.volatilityPercent as number,
    }),
  description:
    "Price a continuously sampled, fixed-strike geometric-average Asian call or put in closed form; this is not an arithmetic-average Asian option model.",
  id: "finance/geometric-asian-option",
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
  ],
  outputs: [
    { id: "optionPrice", kind: "number", label: "Option price" },
    {
      id: "expectedDiscountedGeometricAverage",
      kind: "number",
      label: "Discounted expected geometric average",
    },
  ],
  title: "Geometric Asian Option Calculator",
});
export const runGeometricAsianOption = geometricAsianOptionTool.execute;
export default geometricAsianOptionTool;
