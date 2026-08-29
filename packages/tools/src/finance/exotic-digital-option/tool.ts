import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { digitalOptionPrice } from "../option-core.js";

export const example = {
  input: {
    spotPrice: 100,
    strikePrice: 100,
    timeYears: 1,
    riskFreeRatePercent: 0,
    dividendYieldPercent: 0,
    volatilityPercent: 20,
    cashPayoff: 1,
    optionType: "call",
  },
  output: {
    optionPrice: 0.46017210379166884,
    exerciseProbability: 0.46017210379166884,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "finance/exotic-digital-option",
  title: "Cash-or-Nothing Digital Option Pricing Calculator",
  description:
    "Price a European cash-or-nothing digital call or put under Black–Scholes–Merton with continuous dividend yield. This covers one exotic payoff, not every exotic option.",
  inputs: [
    { id: "spotPrice", kind: "number", label: "spot Price", minimum: 5e-324 },
    {
      id: "strikePrice",
      kind: "number",
      label: "strike Price",
      minimum: 5e-324,
    },
    { id: "timeYears", kind: "number", label: "time Years", minimum: 5e-324 },
    {
      id: "riskFreeRatePercent",
      kind: "number",
      label: "risk Free Rate Percent",
    },
    {
      id: "dividendYieldPercent",
      kind: "number",
      label: "dividend Yield Percent",
    },
    {
      id: "volatilityPercent",
      kind: "number",
      label: "volatility Percent",
      minimum: 0,
    },
    { id: "cashPayoff", kind: "number", label: "cash Payoff", minimum: 0 },
    {
      id: "optionType",
      kind: "string",
      label: "option Type",
      enum: ["call", "put"],
    },
  ],
  outputs: [
    { id: "optionPrice", kind: "number", label: "option Price" },
    {
      id: "exerciseProbability",
      kind: "number",
      label: "exercise Probability",
    },
  ],
  calculate: (input) =>
    digitalOptionPrice(
      input.spotPrice as number,
      input.strikePrice as number,
      input.timeYears as number,
      input.riskFreeRatePercent as number,
      input.dividendYieldPercent as number,
      input.volatilityPercent as number,
      input.cashPayoff as number,
      input.optionType as string,
    ),
});
export type ExoticDigitalOptionInput = Readonly<typeof example.input>;
export type ExoticDigitalOptionOutput = Readonly<typeof example.output>;
export const exoticDigitalOptionTool = tool;
export const runExoticDigitalOption = tool.execute;
export default tool;
