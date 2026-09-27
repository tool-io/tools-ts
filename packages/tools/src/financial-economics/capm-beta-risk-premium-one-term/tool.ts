import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly riskFreeRate: number;
  readonly marketExpectedReturn: number;
  readonly beta: number;
};
export type Output = {
  readonly marketPremium: number;
  readonly expectedReturn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    riskFreeRate: { type: "number" },
    marketExpectedReturn: { type: "number" },
    beta: { type: "number" },
  },
  required: ["riskFreeRate", "marketExpectedReturn", "beta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marketPremium: { type: "number" },
    expectedReturn: { type: "number" },
  },
  required: ["marketPremium", "expectedReturn"],
} as const;
/** Single-period CAPM expected return from matched-period caller assumptions, not an investment recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { riskFreeRate, marketExpectedReturn, beta } = request;
  const compute = (): Output => {
    return {
      marketPremium: marketExpectedReturn - riskFreeRate,
      expectedReturn:
        riskFreeRate + beta * (marketExpectedReturn - riskFreeRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { riskFreeRate: 0.03, marketExpectedReturn: 0.08, beta: 1.2 },
  output: { marketPremium: 0.05, expectedReturn: 0.09 },
} satisfies ToolExample<Input, Output>;
export const capmBetaRiskPremiumOneTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/capm-beta-risk-premium-one-term",
    title: "Capm Beta Risk Premium One Term Tool",
    description:
      "Single-period CAPM expected return from matched-period caller assumptions, not an investment recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        riskFreeRate: { type: "number" },
        marketExpectedReturn: { type: "number" },
        beta: { type: "number" },
      },
      required: ["riskFreeRate", "marketExpectedReturn", "beta"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marketPremium: { type: "number" },
        expectedReturn: { type: "number" },
      },
      required: ["marketPremium", "expectedReturn"],
    },
    ports: {
      inputs: [
        {
          id: "riskFreeRate",
          label: "Risk Free Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "marketExpectedReturn",
          label: "Market Expected Return",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beta",
          label: "Beta",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "marketPremium",
          label: "Market Premium",
          valueType: { type: "number" },
        },
        {
          id: "expectedReturn",
          label: "Expected Return",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = capmBetaRiskPremiumOneTermTool.execute;
export default capmBetaRiskPremiumOneTermTool;
