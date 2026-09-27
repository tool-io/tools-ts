import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly periodReturn: number;
  readonly riskFreeAnnual: number;
  readonly periodsPerYear: number;
  readonly periodVolatility: number;
};
export type Output = {
  readonly periodRiskFree: number;
  readonly periodSharpe: number;
  readonly annualizedSharpe: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodReturn: { type: "number" },
    riskFreeAnnual: { type: "number", exclusiveMinimum: -1 },
    periodsPerYear: { type: "number", exclusiveMinimum: 0 },
    periodVolatility: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "periodReturn",
    "riskFreeAnnual",
    "periodsPerYear",
    "periodVolatility",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodRiskFree: { type: "number" },
    periodSharpe: { type: "number" },
    annualizedSharpe: { type: "number" },
  },
  required: ["periodRiskFree", "periodSharpe", "annualizedSharpe"],
} as const;
/** Effective annual risk-free conversion and square-root Sharpe annualization assuming identically distributed uncorrelated excess returns. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { periodReturn, riskFreeAnnual, periodsPerYear, periodVolatility } =
    request;
  const compute = (): Output => {
    H.domain(riskFreeAnnual > -1);
    H.positive(periodsPerYear);
    H.positive(periodVolatility);
    return {
      periodRiskFree: Math.expm1(Math.log1p(riskFreeAnnual) / periodsPerYear),
      periodSharpe:
        (periodReturn -
          Math.expm1(Math.log1p(riskFreeAnnual) / periodsPerYear)) /
        periodVolatility,
      annualizedSharpe:
        ((periodReturn -
          Math.expm1(Math.log1p(riskFreeAnnual) / periodsPerYear)) *
          Math.sqrt(periodsPerYear)) /
        periodVolatility,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    periodReturn: 0.02,
    riskFreeAnnual: 0,
    periodsPerYear: 12,
    periodVolatility: 0.04,
  },
  output: {
    periodRiskFree: 0,
    periodSharpe: 0.5,
    annualizedSharpe: 1.7320508075688772,
  },
} satisfies ToolExample<Input, Output>;
export const sharpeRiskFreeFrequencyConsistencyTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "financial-economics/sharpe-risk-free-frequency-consistency-term",
      title: "Sharpe Risk Free Frequency Consistency Term Tool",
      description:
        "Effective annual risk-free conversion and square-root Sharpe annualization assuming identically distributed uncorrelated excess returns.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          periodReturn: { type: "number" },
          riskFreeAnnual: { type: "number", exclusiveMinimum: -1 },
          periodsPerYear: { type: "number", exclusiveMinimum: 0 },
          periodVolatility: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "periodReturn",
          "riskFreeAnnual",
          "periodsPerYear",
          "periodVolatility",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          periodRiskFree: { type: "number" },
          periodSharpe: { type: "number" },
          annualizedSharpe: { type: "number" },
        },
        required: ["periodRiskFree", "periodSharpe", "annualizedSharpe"],
      },
      ports: {
        inputs: [
          {
            id: "periodReturn",
            label: "Period Return",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "riskFreeAnnual",
            label: "Risk Free Annual",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "periodsPerYear",
            label: "Periods Per Year",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "periodVolatility",
            label: "Period Volatility",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "periodRiskFree",
            label: "Period Risk Free",
            valueType: { type: "number" },
          },
          {
            id: "periodSharpe",
            label: "Period Sharpe",
            valueType: { type: "number" },
          },
          {
            id: "annualizedSharpe",
            label: "Annualized Sharpe",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sharpeRiskFreeFrequencyConsistencyTermTool.execute;
export default sharpeRiskFreeFrequencyConsistencyTermTool;
