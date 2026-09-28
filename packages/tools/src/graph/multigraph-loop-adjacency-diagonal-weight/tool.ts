import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly loopWeights: readonly number[];
  readonly doubleOnDiagonal: boolean;
};
export type Output = {
  readonly diagonal: number;
  readonly degreeContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loopWeights: { type: "array", maxItems: 256, items: { type: "number" } },
    doubleOnDiagonal: { type: "boolean" },
  },
  required: ["loopWeights", "doubleOnDiagonal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diagonal: { type: "number" },
    degreeContribution: { type: "number" },
  },
  required: ["diagonal", "degreeContribution"],
} as const;
/** Compute multigraph loop adjacency diagonal weight from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { loopWeights, doubleOnDiagonal } = input;
  const compute = (): Output => {
    const total = loopWeights.reduce((a, b) => a + b, 0);
    return {
      diagonal: total * (doubleOnDiagonal ? 2 : 1),
      degreeContribution: 2 * total,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { loopWeights: [2, 3], doubleOnDiagonal: false },
  output: { diagonal: 5, degreeContribution: 10 },
} satisfies ToolExample<Input, Output>;
export const multigraphLoopAdjacencyDiagonalWeightTool =
  defineSchemaCalculation<Input, Output>({
    id: "graph/multigraph-loop-adjacency-diagonal-weight",
    title: "Multigraph Loop Adjacency Diagonal Weight Tool",
    description:
      "Compute multigraph loop adjacency diagonal weight from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "loopWeights",
          label: "Loop Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "doubleOnDiagonal",
          label: "Double On Diagonal",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "diagonal", label: "Diagonal", valueType: { type: "number" } },
        {
          id: "degreeContribution",
          label: "Degree Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = multigraphLoopAdjacencyDiagonalWeightTool.execute;
export default multigraphLoopAdjacencyDiagonalWeightTool;
