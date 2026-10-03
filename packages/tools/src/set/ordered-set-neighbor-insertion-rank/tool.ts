import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sorted: readonly number[];
  readonly value: number;
};
export type Output = {
  readonly rank: number;
  readonly predecessor: number;
  readonly successor: number;
  readonly hasPredecessor: boolean;
  readonly hasSuccessor: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sorted: { type: "array", maxItems: 256, items: { type: "number" } },
    value: { type: "number" },
  },
  required: ["sorted", "value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rank: { type: "integer" },
    predecessor: { type: "number" },
    successor: { type: "number" },
    hasPredecessor: { type: "boolean" },
    hasSuccessor: { type: "boolean" },
  },
  required: [
    "rank",
    "predecessor",
    "successor",
    "hasPredecessor",
    "hasSuccessor",
  ],
} as const;
/** Calculate ordered set neighbor insertion rank from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sorted, value } = request;
  const compute = (): Output => {
    H.domain(
      sorted.every((x, i) => i === 0 || sorted[i - 1] < x) &&
        !sorted.includes(value),
    );
    let rank = sorted.findIndex((x) => x > value);
    if (rank < 0) rank = sorted.length;
    return {
      rank,
      predecessor: rank > 0 ? sorted[rank - 1] : 0,
      successor: rank < sorted.length ? sorted[rank] : 0,
      hasPredecessor: rank > 0,
      hasSuccessor: rank < sorted.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sorted: [2, 5, 8], value: 6 },
  output: {
    rank: 2,
    predecessor: 5,
    successor: 8,
    hasPredecessor: true,
    hasSuccessor: true,
  },
} satisfies ToolExample<Input, Output>;
export const orderedSetNeighborInsertionRankTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/ordered-set-neighbor-insertion-rank",
    title: "Ordered Set Neighbor Insertion Rank Tool",
    description:
      "Calculate ordered set neighbor insertion rank from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sorted: { type: "array", maxItems: 256, items: { type: "number" } },
        value: { type: "number" },
      },
      required: ["sorted", "value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rank: { type: "integer" },
        predecessor: { type: "number" },
        successor: { type: "number" },
        hasPredecessor: { type: "boolean" },
        hasSuccessor: { type: "boolean" },
      },
      required: [
        "rank",
        "predecessor",
        "successor",
        "hasPredecessor",
        "hasSuccessor",
      ],
    },
    ports: {
      inputs: [
        {
          id: "sorted",
          label: "Sorted",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rank", label: "Rank", valueType: { type: "integer" } },
        {
          id: "predecessor",
          label: "Predecessor",
          valueType: { type: "number" },
        },
        { id: "successor", label: "Successor", valueType: { type: "number" } },
        {
          id: "hasPredecessor",
          label: "Has Predecessor",
          valueType: { type: "boolean" },
        },
        {
          id: "hasSuccessor",
          label: "Has Successor",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = orderedSetNeighborInsertionRankTool.execute;
export default orderedSetNeighborInsertionRankTool;
