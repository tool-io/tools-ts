import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly number[];
  readonly weights: readonly number[];
};
export type Output = {
  readonly defined: boolean;
  readonly totalWeight: number;
  readonly weightedValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["values", "weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defined: { type: "boolean" },
    totalWeight: { type: "number" },
    weightedValue: { type: "number" },
  },
  required: ["defined", "totalWeight", "weightedValue"],
} as const;
/** Calculate source weight zero support case from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, weights } = request;
  const compute = (): Output => {
    H.sameLength(values, weights);
    H.domain(weights.every((x) => x >= 0));
    return {
      defined: weights.some((x) => x > 0),
      totalWeight: weights.reduce((a, b) => a + b, 0),
      weightedValue: weights.some((x) => x > 0)
        ? H.dot(values, weights) / weights.reduce((a, b) => a + b, 0)
        : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { values: [2, 4], weights: [0, 0] },
  output: { defined: false, totalWeight: 0, weightedValue: 0 },
} satisfies ToolExample<Input, Output>;
export const sourceWeightZeroSupportCaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/source-weight-zero-support-case",
    title: "Source Weight Zero Support Case Tool",
    description:
      "Calculate source weight zero support case from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: { type: "array", maxItems: 256, items: { type: "number" } },
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["values", "weights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        totalWeight: { type: "number" },
        weightedValue: { type: "number" },
      },
      required: ["defined", "totalWeight", "weightedValue"],
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
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "totalWeight",
          label: "Total Weight",
          valueType: { type: "number" },
        },
        {
          id: "weightedValue",
          label: "Weighted Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sourceWeightZeroSupportCaseTool.execute;
export default sourceWeightZeroSupportCaseTool;
