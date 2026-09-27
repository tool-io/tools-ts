import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly longYield: number;
  readonly expectedShortRates: readonly number[];
  readonly maturityWeights: readonly number[];
};
export type Output = {
  readonly expectedAverage: number;
  readonly residualPremium: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    longYield: { type: "number" },
    expectedShortRates: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    maturityWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["longYield", "expectedShortRates", "maturityWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedAverage: { type: "number" },
    residualPremium: { type: "number" },
  },
  required: ["expectedAverage", "residualPremium"],
} as const;
/** Yield-minus-weighted-short-rate residual under the supplied expectations approximation; not an estimated term-premium model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { longYield, expectedShortRates, maturityWeights } = request;
  const compute = (): Output => {
    H.sameLength(expectedShortRates, maturityWeights);
    H.domain(
      expectedShortRates.length > 0 &&
        maturityWeights.every((x) => x >= 0) &&
        Math.abs(maturityWeights.reduce((a, b) => a + b, 0) - 1) <= 1e-12,
    );
    return {
      expectedAverage: H.dot(expectedShortRates, maturityWeights),
      residualPremium: longYield - H.dot(expectedShortRates, maturityWeights),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    longYield: 0.05,
    expectedShortRates: [0.02, 0.04],
    maturityWeights: [0.5, 0.5],
  },
  output: { expectedAverage: 0.03, residualPremium: 0.020000000000000004 },
} satisfies ToolExample<Input, Output>;
export const termPremiumExpectationResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/term-premium-expectation-residual",
    title: "Term Premium Expectation Residual Tool",
    description:
      "Yield-minus-weighted-short-rate residual under the supplied expectations approximation; not an estimated term-premium model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        longYield: { type: "number" },
        expectedShortRates: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        maturityWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["longYield", "expectedShortRates", "maturityWeights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedAverage: { type: "number" },
        residualPremium: { type: "number" },
      },
      required: ["expectedAverage", "residualPremium"],
    },
    ports: {
      inputs: [
        {
          id: "longYield",
          label: "Long Yield",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expectedShortRates",
          label: "Expected Short Rates",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "maturityWeights",
          label: "Maturity Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "expectedAverage",
          label: "Expected Average",
          valueType: { type: "number" },
        },
        {
          id: "residualPremium",
          label: "Residual Premium",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = termPremiumExpectationResidualTool.execute;
export default termPremiumExpectationResidualTool;
