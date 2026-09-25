import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sum: number;
  readonly squaredSum: number;
  readonly observed: number;
  readonly total: number;
};
export type Output = {
  readonly mean: number;
  readonly populationVariance: number;
  readonly observedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sum: { type: "number" },
    squaredSum: { type: "number", minimum: 0 },
    observed: { type: "integer", minimum: 1 },
    total: { type: "integer", minimum: 1 },
  },
  required: ["sum", "squaredSum", "observed", "total"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mean: { type: "number" },
    populationVariance: { type: "number" },
    observedFraction: { type: "number" },
  },
  required: ["mean", "populationVariance", "observedFraction"],
} as const;
/** Population variance from explicit nonmissing sufficient statistics; reject materially inconsistent sums rather than treating missing rows as zeros. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sum, squaredSum, observed, total } = request;
  const compute = (): Output => {
    H.integer(total, 1);
    H.integer(observed, 1, total);
    H.domain(squaredSum >= 0 && squaredSum / observed >= (sum / observed) ** 2);
    return {
      mean: sum / observed,
      populationVariance: squaredSum / observed - (sum / observed) ** 2,
      observedFraction: observed / total,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sum: 6, squaredSum: 14, observed: 3, total: 4 },
  output: {
    mean: 2,
    populationVariance: 0.666666666666667,
    observedFraction: 0.75,
  },
} satisfies ToolExample<Input, Output>;
export const standardizationMissingCellDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "data-science/standardization-missing-cell-denominator",
      title: "Standardization Missing Cell Denominator Tool",
      description:
        "Population variance from explicit nonmissing sufficient statistics; reject materially inconsistent sums rather than treating missing rows as zeros.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sum: { type: "number" },
          squaredSum: { type: "number", minimum: 0 },
          observed: { type: "integer", minimum: 1 },
          total: { type: "integer", minimum: 1 },
        },
        required: ["sum", "squaredSum", "observed", "total"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mean: { type: "number" },
          populationVariance: { type: "number" },
          observedFraction: { type: "number" },
        },
        required: ["mean", "populationVariance", "observedFraction"],
      },
      ports: {
        inputs: [
          {
            id: "sum",
            label: "Sum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "squaredSum",
            label: "Squared Sum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "total",
            label: "Total",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "mean", label: "Mean", valueType: { type: "number" } },
          {
            id: "populationVariance",
            label: "Population Variance",
            valueType: { type: "number" },
          },
          {
            id: "observedFraction",
            label: "Observed Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = standardizationMissingCellDenominatorTool.execute;
export default standardizationMissingCellDenominatorTool;
