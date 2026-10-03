import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly number[];
  readonly weights: readonly number[];
  readonly probability: number;
  readonly inclusive: boolean;
};
export type Output = {
  readonly value: number;
  readonly index: number;
  readonly cumulativeWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
    probability: { type: "number", minimum: 0, maximum: 1 },
    inclusive: { type: "boolean" },
  },
  required: ["values", "weights", "probability", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    index: { type: "integer" },
    cumulativeWeight: { type: "number" },
  },
  required: ["value", "index", "cumulativeWeight"],
} as const;
/** Weighted empirical inverse using an explicit >= versus > atom-boundary convention, clamped at probability one. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, weights, probability, inclusive } = request;
  const compute = (): Output => {
    H.sameLength(values, weights);
    H.probability(probability);
    H.domain(
      values.length > 0 &&
        values.every((x, i) => i === 0 || x > values[i - 1]) &&
        weights.every((x) => x > 0),
    );
    const total = H.finite(weights.reduce((a, b) => a + b, 0)),
      target = total * probability;
    let cumulativeWeight = 0,
      index = values.length - 1;
    for (let i = 0; i < values.length; i++) {
      cumulativeWeight += weights[i];
      if (inclusive ? cumulativeWeight >= target : cumulativeWeight > target) {
        index = i;
        break;
      }
    }
    return { value: values[index], index, cumulativeWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    values: [10, 20],
    weights: [1, 1],
    probability: 0.5,
    inclusive: true,
  },
  output: { value: 10, index: 0, cumulativeWeight: 1 },
} satisfies ToolExample<Input, Output>;
export const weightedQuantileAtomBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/weighted-quantile-atom-boundary",
    title: "Weighted Quantile Atom Boundary Tool",
    description:
      "Weighted empirical inverse using an explicit >= versus > atom-boundary convention, clamped at probability one.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: { type: "array", maxItems: 256, items: { type: "number" } },
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
        probability: { type: "number", minimum: 0, maximum: 1 },
        inclusive: { type: "boolean" },
      },
      required: ["values", "weights", "probability", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        index: { type: "integer" },
        cumulativeWeight: { type: "number" },
      },
      required: ["value", "index", "cumulativeWeight"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "number" } },
        { id: "index", label: "Index", valueType: { type: "integer" } },
        {
          id: "cumulativeWeight",
          label: "Cumulative Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = weightedQuantileAtomBoundaryTool.execute;
export default weightedQuantileAtomBoundaryTool;
