import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
  readonly higherIsBetter: readonly boolean[];
};
export type Output = {
  readonly firstDominates: boolean;
  readonly secondDominates: boolean;
  readonly equal: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
    higherIsBetter: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["first", "second", "higherIsBetter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDominates: { type: "boolean" },
    secondDominates: { type: "boolean" },
    equal: { type: "boolean" },
  },
  required: ["firstDominates", "secondDominates", "equal"],
} as const;
/** Pareto dominance of explicit attributes; dominance alone does not predict a decoy-choice effect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, higherIsBetter } = request;
  const compute = (): Output => {
    H.sameLength(first, second);
    H.sameLength(first, higherIsBetter);
    H.domain(first.length > 0);
    const gaps = first.map(
      (x, i) => (higherIsBetter[i] ? 1 : -1) * (x - second[i]),
    );
    return {
      firstDominates: gaps.every((x) => x >= 0) && gaps.some((x) => x > 0),
      secondDominates: gaps.every((x) => x <= 0) && gaps.some((x) => x < 0),
      equal: gaps.every((x) => x === 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: [10, 5], second: [8, 6], higherIsBetter: [true, false] },
  output: { firstDominates: true, secondDominates: false, equal: false },
} satisfies ToolExample<Input, Output>;
export const decoyChoiceDominanceOnePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/decoy-choice-dominance-one-pair",
    title: "Decoy Choice Dominance One Pair Tool",
    description:
      "Pareto dominance of explicit attributes; dominance alone does not predict a decoy-choice effect.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", maxItems: 256, items: { type: "number" } },
        second: { type: "array", maxItems: 256, items: { type: "number" } },
        higherIsBetter: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["first", "second", "higherIsBetter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDominates: { type: "boolean" },
        secondDominates: { type: "boolean" },
        equal: { type: "boolean" },
      },
      required: ["firstDominates", "secondDominates", "equal"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "higherIsBetter",
          label: "Higher Is Better",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "firstDominates",
          label: "First Dominates",
          valueType: { type: "boolean" },
        },
        {
          id: "secondDominates",
          label: "Second Dominates",
          valueType: { type: "boolean" },
        },
        { id: "equal", label: "Equal", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = decoyChoiceDominanceOnePairTool.execute;
export default decoyChoiceDominanceOnePairTool;
