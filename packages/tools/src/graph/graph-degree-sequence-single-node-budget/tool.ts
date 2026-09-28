import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly nodes: number; readonly degree: number };
export type Output = {
  readonly remainingNeighbors: number;
  readonly feasible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodes: { type: "integer", minimum: 1 },
    degree: { type: "integer", minimum: 0 },
  },
  required: ["nodes", "degree"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingNeighbors: { type: "integer" },
    feasible: { type: "boolean" },
  },
  required: ["remainingNeighbors", "feasible"],
} as const;
/** Calculate graph degree sequence single node budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nodes, degree } = request;
  const compute = (): Output => {
    H.integer(nodes, 1);
    H.integer(degree, 0);
    return { remainingNeighbors: nodes - 1 - degree, feasible: degree < nodes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nodes: 6, degree: 3 },
  output: { remainingNeighbors: 2, feasible: true },
} satisfies ToolExample<Input, Output>;
export const graphDegreeSequenceSingleNodeBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "graph/graph-degree-sequence-single-node-budget",
      title: "Graph Degree Sequence Single Node Budget Tool",
      description:
        "Calculate graph degree sequence single node budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nodes: { type: "integer", minimum: 1 },
          degree: { type: "integer", minimum: 0 },
        },
        required: ["nodes", "degree"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingNeighbors: { type: "integer" },
          feasible: { type: "boolean" },
        },
        required: ["remainingNeighbors", "feasible"],
      },
      ports: {
        inputs: [
          {
            id: "nodes",
            label: "Nodes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "degree",
            label: "Degree",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "remainingNeighbors",
            label: "Remaining Neighbors",
            valueType: { type: "integer" },
          },
          { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = graphDegreeSequenceSingleNodeBudgetTool.execute;
export default graphDegreeSequenceSingleNodeBudgetTool;
