import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstWeight: number;
  readonly secondWeight: number;
  readonly covariance: number;
  readonly sameAsset: boolean;
};
export type Output = { readonly varianceContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstWeight: { type: "number" },
    secondWeight: { type: "number" },
    covariance: { type: "number" },
    sameAsset: { type: "boolean" },
  },
  required: ["firstWeight", "secondWeight", "covariance", "sameAsset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { varianceContribution: { type: "number" } },
  required: ["varianceContribution"],
} as const;
/** One diagonal or paired off-diagonal portfolio covariance contribution; caller identifies whether the term is diagonal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstWeight, secondWeight, covariance, sameAsset } = request;
  const compute = (): Output => {
    return {
      varianceContribution:
        firstWeight * secondWeight * covariance * (sameAsset ? 1 : 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstWeight: 0.4,
    secondWeight: 0.6,
    covariance: 0.01,
    sameAsset: false,
  },
  output: { varianceContribution: 0.0048 },
} satisfies ToolExample<Input, Output>;
export const portfolioVarianceOneCovarianceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/portfolio-variance-one-covariance-term",
    title: "Portfolio Variance One Covariance Term Tool",
    description:
      "One diagonal or paired off-diagonal portfolio covariance contribution; caller identifies whether the term is diagonal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstWeight: { type: "number" },
        secondWeight: { type: "number" },
        covariance: { type: "number" },
        sameAsset: { type: "boolean" },
      },
      required: ["firstWeight", "secondWeight", "covariance", "sameAsset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { varianceContribution: { type: "number" } },
      required: ["varianceContribution"],
    },
    ports: {
      inputs: [
        {
          id: "firstWeight",
          label: "First Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondWeight",
          label: "Second Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "covariance",
          label: "Covariance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sameAsset",
          label: "Same Asset",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "varianceContribution",
          label: "Variance Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = portfolioVarianceOneCovarianceTermTool.execute;
export default portfolioVarianceOneCovarianceTermTool;
