import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly meanYield: number;
  readonly meanPrice: number;
  readonly suppliedCovariance: number;
};
export type Output = {
  readonly meanProduct: number;
  readonly covarianceContribution: number;
  readonly expectedRevenue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanYield: { type: "number" },
    meanPrice: { type: "number" },
    suppliedCovariance: { type: "number" },
  },
  required: ["meanYield", "meanPrice", "suppliedCovariance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanProduct: { type: "number" },
    covarianceContribution: { type: "number" },
    expectedRevenue: { type: "number" },
  },
  required: ["meanProduct", "covarianceContribution", "expectedRevenue"],
} as const;
/** Use E[YP]=E[Y]E[P]+Cov(Y,P) with an independently supplied covariance in compatible units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { meanYield, meanPrice, suppliedCovariance } = request;
  const compute = (): Output => {
    return {
      meanProduct: meanYield * meanPrice,
      covarianceContribution: suppliedCovariance,
      expectedRevenue: meanYield * meanPrice + suppliedCovariance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { meanYield: 10, meanPrice: 5, suppliedCovariance: 2 },
  output: { meanProduct: 50, covarianceContribution: 2, expectedRevenue: 52 },
} satisfies ToolExample<Input, Output>;
export const yieldPriceCovarianceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/yield-price-covariance-term",
    title: "Yield Price Covariance Term Tool",
    description:
      "Use E[YP]=E[Y]E[P]+Cov(Y,P) with an independently supplied covariance in compatible units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanYield: { type: "number" },
        meanPrice: { type: "number" },
        suppliedCovariance: { type: "number" },
      },
      required: ["meanYield", "meanPrice", "suppliedCovariance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanProduct: { type: "number" },
        covarianceContribution: { type: "number" },
        expectedRevenue: { type: "number" },
      },
      required: ["meanProduct", "covarianceContribution", "expectedRevenue"],
    },
    ports: {
      inputs: [
        {
          id: "meanYield",
          label: "Mean Yield",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "meanPrice",
          label: "Mean Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCovariance",
          label: "Supplied Covariance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "meanProduct",
          label: "Mean Product",
          valueType: { type: "number" },
        },
        {
          id: "covarianceContribution",
          label: "Covariance Contribution",
          valueType: { type: "number" },
        },
        {
          id: "expectedRevenue",
          label: "Expected Revenue",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = yieldPriceCovarianceTermTool.execute;
export default yieldPriceCovarianceTermTool;
