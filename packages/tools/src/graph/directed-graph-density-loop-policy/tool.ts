import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly vertices: number;
  readonly edges: number;
  readonly allowLoops: boolean;
};
export type Output = {
  readonly possibleEdges: number;
  readonly density: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertices: { type: "integer", minimum: 1, maximum: 1000000 },
    edges: { type: "integer", minimum: 0 },
    allowLoops: { type: "boolean" },
  },
  required: ["vertices", "edges", "allowLoops"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    possibleEdges: { type: "number" },
    density: { type: "number" },
  },
  required: ["possibleEdges", "density"],
} as const;
/** Compute directed graph density loop policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { vertices, edges, allowLoops } = input;
  const compute = (): Output => {
    integer(vertices, 1, 1000000);
    integer(edges);
    const possibleEdges = vertices * (vertices - (allowLoops ? 0 : 1));
    positive(possibleEdges);
    domain(edges <= possibleEdges);
    return { possibleEdges, density: edges / possibleEdges };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { vertices: 3, edges: 3, allowLoops: false },
  output: { possibleEdges: 6, density: 0.5 },
} satisfies ToolExample<Input, Output>;
export const directedGraphDensityLoopPolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "graph/directed-graph-density-loop-policy",
  title: "Directed Graph Density Loop Policy Tool",
  description:
    "Compute directed graph density loop policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "vertices",
        label: "Vertices",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "edges",
        label: "Edges",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "allowLoops",
        label: "Allow Loops",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "possibleEdges",
        label: "Possible Edges",
        valueType: { type: "number" },
      },
      { id: "density", label: "Density", valueType: { type: "number" } },
    ],
  },
});
export const run = directedGraphDensityLoopPolicyTool.execute;
export default directedGraphDensityLoopPolicyTool;
