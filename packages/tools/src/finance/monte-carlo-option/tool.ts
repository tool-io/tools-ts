import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { monteCarloEuropean } from "../option-core.js";

export const example = {
  input: {
    spotPrice: 100,
    strikePrice: 100,
    timeYears: 1,
    riskFreeRatePercent: 0,
    dividendYieldPercent: 0,
    volatilityPercent: 20,
    optionType: "call",
    pathCount: 1000,
    seed: "tool.io",
  },
  output: {
    optionPrice: 7.654456157163572,
    standardError: 0.34009527479234297,
    paths: 1000,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "finance/monte-carlo-option",
  title: "Monte Carlo European Option Pricing Calculator",
  description:
    "Estimate a European call or put price under geometric Brownian motion with antithetic normal pairs and report a Monte Carlo standard error. This is a model estimate, not a market quote.",
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
    {
      id: "optionType",
      kind: "string",
      label: "option Type",
      enum: ["call", "put"],
    },
    {
      id: "pathCount",
      kind: "integer",
      label: "path Count",
      minimum: 2,
      maximum: 100000,
    },
    { id: "seed", kind: "string", label: "seed" },
  ],
  outputs: [
    { id: "optionPrice", kind: "number", label: "option Price" },
    { id: "standardError", kind: "number", label: "standard Error" },
    { id: "paths", kind: "integer", label: "paths" },
  ],
  calculate: (input) =>
    monteCarloEuropean(
      input.spotPrice as number,
      input.strikePrice as number,
      input.timeYears as number,
      input.riskFreeRatePercent as number,
      input.dividendYieldPercent as number,
      input.volatilityPercent as number,
      input.optionType as string,
      input.pathCount as number,
      input.seed as string,
    ),
});
export type MonteCarloOptionInput = Readonly<typeof example.input>;
export type MonteCarloOptionOutput = Readonly<typeof example.output>;
export const monteCarloOptionTool = tool;
export const runMonteCarloOption = tool.execute;
export default tool;
