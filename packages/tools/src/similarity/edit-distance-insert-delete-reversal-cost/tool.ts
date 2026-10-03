import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly insertions: number;
  readonly deletions: number;
  readonly insertionCost: number;
  readonly deletionCost: number;
};
export type Output = {
  readonly forward: number;
  readonly reverse: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insertions: { type: "integer", minimum: 0 },
    deletions: { type: "integer", minimum: 0 },
    insertionCost: { type: "number", minimum: 0 },
    deletionCost: { type: "number", minimum: 0 },
  },
  required: ["insertions", "deletions", "insertionCost", "deletionCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forward: { type: "number" },
    reverse: { type: "number" },
    gap: { type: "number" },
  },
  required: ["forward", "reverse", "gap"],
} as const;
/** Calculate edit distance insert delete reversal cost from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { insertions, deletions, insertionCost, deletionCost } = request;
  const compute = (): Output => {
    H.integer(insertions, 0);
    H.integer(deletions, 0);
    H.domain(insertionCost >= 0 && deletionCost >= 0);
    const forward = insertions * insertionCost + deletions * deletionCost,
      reverse = deletions * insertionCost + insertions * deletionCost;
    return { forward, reverse, gap: reverse - forward };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { insertions: 3, deletions: 1, insertionCost: 2, deletionCost: 4 },
  output: { forward: 10, reverse: 14, gap: 4 },
} satisfies ToolExample<Input, Output>;
export const editDistanceInsertDeleteReversalCostTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "similarity/edit-distance-insert-delete-reversal-cost",
      title: "Edit Distance Insert Delete Reversal Cost Tool",
      description:
        "Calculate edit distance insert delete reversal cost from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          insertions: { type: "integer", minimum: 0 },
          deletions: { type: "integer", minimum: 0 },
          insertionCost: { type: "number", minimum: 0 },
          deletionCost: { type: "number", minimum: 0 },
        },
        required: ["insertions", "deletions", "insertionCost", "deletionCost"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          forward: { type: "number" },
          reverse: { type: "number" },
          gap: { type: "number" },
        },
        required: ["forward", "reverse", "gap"],
      },
      ports: {
        inputs: [
          {
            id: "insertions",
            label: "Insertions",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "deletions",
            label: "Deletions",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "insertionCost",
            label: "Insertion Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deletionCost",
            label: "Deletion Cost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "forward", label: "Forward", valueType: { type: "number" } },
          { id: "reverse", label: "Reverse", valueType: { type: "number" } },
          { id: "gap", label: "Gap", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = editDistanceInsertDeleteReversalCostTool.execute;
export default editDistanceInsertDeleteReversalCostTool;
