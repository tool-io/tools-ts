import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weights: readonly number[];
  readonly comparable: readonly boolean[];
};
export type Output = {
  readonly positiveSupport: number;
  readonly totalWeight: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    comparable: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["weights", "comparable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveSupport: { type: "integer" },
    totalWeight: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["positiveSupport", "totalWeight", "defined"],
} as const;
/** Calculate weighted distance zero support from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights, comparable } = request;
  const compute = (): Output => {
    H.sameLength(weights, comparable);
    H.domain(weights.every((x) => x >= 0));
    return {
      positiveSupport: weights.filter((x, i) => x > 0 && comparable[i]).length,
      totalWeight: weights.reduce((s, x, i) => s + (comparable[i] ? x : 0), 0),
      defined: weights.some((x, i) => x > 0 && comparable[i]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [0, 2, 3], comparable: [true, false, true] },
  output: { positiveSupport: 1, totalWeight: 3, defined: true },
} satisfies ToolExample<Input, Output>;
export const weightedDistanceZeroSupportTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/weighted-distance-zero-support",
    title: "Weighted Distance Zero Support Tool",
    description:
      "Calculate weighted distance zero support from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        comparable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["weights", "comparable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveSupport: { type: "integer" },
        totalWeight: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["positiveSupport", "totalWeight", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "comparable",
          label: "Comparable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "positiveSupport",
          label: "Positive Support",
          valueType: { type: "integer" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = weightedDistanceZeroSupportTool.execute;
export default weightedDistanceZeroSupportTool;
