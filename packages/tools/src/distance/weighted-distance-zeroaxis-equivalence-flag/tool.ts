import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
  readonly weights: readonly number[];
};
export type Output = {
  readonly equivalent: boolean;
  readonly differingIgnoredAxes: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["first", "second", "weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalent: { type: "boolean" },
    differingIgnoredAxes: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["equivalent", "differingIgnoredAxes"],
} as const;
/** Calculate weighted distance zeroaxis equivalence flag from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, weights } = input;
  const compute = (): Output => {
    H.sameLength(first, second);
    H.sameLength(first, weights);
    H.domain(weights.every((x) => x >= 0));
    return {
      equivalent: first.every((x, i) => weights[i] === 0 || x === second[i]),
      differingIgnoredAxes: first.flatMap((x, i) =>
        weights[i] === 0 && x !== second[i] ? [i] : [],
      ),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: [1, 2], second: [1, 5], weights: [1, 0] },
  output: { equivalent: true, differingIgnoredAxes: [1] },
} satisfies ToolExample<Input, Output>;
export const weightedDistanceZeroaxisEquivalenceFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "distance/weighted-distance-zeroaxis-equivalence-flag",
      title: "Weighted Distance Zeroaxis Equivalence Flag Tool",
      description:
        "Calculate weighted distance zeroaxis equivalence flag from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "array", maxItems: 256, items: { type: "number" } },
          second: { type: "array", maxItems: 256, items: { type: "number" } },
          weights: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["first", "second", "weights"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          equivalent: { type: "boolean" },
          differingIgnoredAxes: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["equivalent", "differingIgnoredAxes"],
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
            id: "weights",
            label: "Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "equivalent",
            label: "Equivalent",
            valueType: { type: "boolean" },
          },
          {
            id: "differingIgnoredAxes",
            label: "Differing Ignored Axes",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = weightedDistanceZeroaxisEquivalenceFlagTool.execute;
export default weightedDistanceZeroaxisEquivalenceFlagTool;
