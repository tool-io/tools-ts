import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type OptionType = "call" | "put";

const normalCdf = (value: number): number => {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * x);
  const erf =
    sign *
    (1 -
      ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
        t +
        0.254829592) *
        t *
        Math.exp(-x * x));
  return 0.5 * (1 + erf);
};

export const blackScholesPrice = (
  spot: number,
  strike: number,
  years: number,
  rate: number,
  volatility: number,
  optionType: OptionType,
): number => {
  const d1 =
    (Math.log(spot / strike) + (rate + volatility ** 2 / 2) * years) /
    (volatility * Math.sqrt(years));
  const d2 = d1 - volatility * Math.sqrt(years);
  const discount = strike * Math.exp(-rate * years);
  const price =
    optionType === "call"
      ? spot * normalCdf(d1) - discount * normalCdf(d2)
      : discount * normalCdf(-d2) - spot * normalCdf(-d1);
  return Number(price.toFixed(6));
};

export const blackScholesExample = {
  input: {
    optionType: "call",
    rate: 0.05,
    spot: 100,
    strike: 100,
    volatility: 0.2,
    years: 1,
  },
  output: { optionValue: 10.450575 },
} satisfies ToolExample<
  {
    readonly optionType: OptionType;
    readonly rate: number;
    readonly spot: number;
    readonly strike: number;
    readonly volatility: number;
    readonly years: number;
  },
  { readonly optionValue: number }
>;

export const blackScholesTool = createSimpleTool({
  id: "finance/black-scholes",
  title: "Black-Scholes Option Calculator",
  description:
    "Estimate a European call or put price with the dividend-free Black-Scholes model.",
  inputs: [
    {
      id: "spot",
      kind: "number",
      label: "Spot price",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "strike",
      kind: "number",
      label: "Strike price",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "years",
      kind: "number",
      label: "Years to expiration",
      minimum: Number.MIN_VALUE,
      unit: "year",
    },
    {
      format: "rate/decimal",
      id: "rate",
      kind: "number",
      label: "Risk-free rate",
    },
    {
      format: "rate/decimal",
      id: "volatility",
      kind: "number",
      label: "Volatility",
      minimum: Number.MIN_VALUE,
    },
    {
      enum: ["call", "put"],
      id: "optionType",
      kind: "string",
      label: "Option type",
    },
  ],
  outputs: [
    { id: "optionValue", kind: "number", label: "Option value", minimum: 0 },
  ],
  calculate: (input) => ({
    optionValue: blackScholesPrice(
      input.spot as number,
      input.strike as number,
      input.years as number,
      input.rate as number,
      input.volatility as number,
      input.optionType as OptionType,
    ),
  }),
});

export const runBlackScholes = blackScholesTool.execute;
export default blackScholesTool;
