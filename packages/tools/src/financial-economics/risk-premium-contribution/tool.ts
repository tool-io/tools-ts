import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assetReturn: number;
  readonly referenceReturn: number;
  readonly portfolioWeight: number;
};
export type Output = {
  readonly premium: number;
  readonly weightedContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assetReturn: { type: "number" },
    referenceReturn: { type: "number" },
    portfolioWeight: { type: "number" },
  },
  required: ["assetReturn", "referenceReturn", "portfolioWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    premium: { type: "number" },
    weightedContribution: { type: "number" },
  },
  required: ["premium", "weightedContribution"],
} as const;
/** Apply a supplied signed portfolio weight to a supplied return spread without inferring expected returns. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assetReturn, referenceReturn, portfolioWeight } = request;
  const compute = (): Output => {
    return {
      premium: assetReturn - referenceReturn,
      weightedContribution: (assetReturn - referenceReturn) * portfolioWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assetReturn: 0.1, referenceReturn: 0.02, portfolioWeight: 0.5 },
  output: { premium: 0.08, weightedContribution: 0.04 },
} satisfies ToolExample<Input, Output>;
export const riskPremiumContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/risk-premium-contribution",
    title: "Risk Premium Contribution Tool",
    description:
      "Apply a supplied signed portfolio weight to a supplied return spread without inferring expected returns.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assetReturn: { type: "number" },
        referenceReturn: { type: "number" },
        portfolioWeight: { type: "number" },
      },
      required: ["assetReturn", "referenceReturn", "portfolioWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        premium: { type: "number" },
        weightedContribution: { type: "number" },
      },
      required: ["premium", "weightedContribution"],
    },
    ports: {
      inputs: [
        {
          id: "assetReturn",
          label: "Asset Return",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceReturn",
          label: "Reference Return",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "portfolioWeight",
          label: "Portfolio Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "premium", label: "Premium", valueType: { type: "number" } },
        {
          id: "weightedContribution",
          label: "Weighted Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = riskPremiumContributionTool.execute;
export default riskPremiumContributionTool;
