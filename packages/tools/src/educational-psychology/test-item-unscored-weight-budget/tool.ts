import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weights: readonly number[];
  readonly scored: readonly boolean[];
};
export type Output = {
  readonly scoredWeight: number;
  readonly unscoredWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
    scored: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["weights", "scored"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scoredWeight: { type: "number" },
    unscoredWeight: { type: "number" },
  },
  required: ["scoredWeight", "unscoredWeight"],
} as const;
/** Calculate test item unscored weight budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights, scored } = request;
  const compute = (): Output => {
    H.sameLength(weights, scored);
    H.domain(weights.every((x) => x >= 0));
    return {
      scoredWeight: weights.reduce((s, x, i) => s + (scored[i] ? x : 0), 0),
      unscoredWeight: weights.reduce((s, x, i) => s + (scored[i] ? 0 : x), 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [1, 2, 3], scored: [true, false, true] },
  output: { scoredWeight: 4, unscoredWeight: 2 },
} satisfies ToolExample<Input, Output>;
export const testItemUnscoredWeightBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/test-item-unscored-weight-budget",
    title: "Test Item Unscored Weight Budget Tool",
    description:
      "Calculate test item unscored weight budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
        scored: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["weights", "scored"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scoredWeight: { type: "number" },
        unscoredWeight: { type: "number" },
      },
      required: ["scoredWeight", "unscoredWeight"],
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
          id: "scored",
          label: "Scored",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "scoredWeight",
          label: "Scored Weight",
          valueType: { type: "number" },
        },
        {
          id: "unscoredWeight",
          label: "Unscored Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = testItemUnscoredWeightBudgetTool.execute;
export default testItemUnscoredWeightBudgetTool;
