import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vertices: number;
  readonly parentEdges: number;
  readonly rootCount: number;
};
export type Output = {
  readonly expectedParentEdges: number;
  readonly deficit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertices: { type: "integer", minimum: 0 },
    parentEdges: { type: "integer", minimum: 0 },
    rootCount: { type: "integer", minimum: 0 },
  },
  required: ["vertices", "parentEdges", "rootCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedParentEdges: { type: "integer" },
    deficit: { type: "integer" },
  },
  required: ["expectedParentEdges", "deficit"],
} as const;
/** Compare supplied rooted-forest cardinality witnesses; edge counts alone do not prove a tree or forest. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vertices, parentEdges, rootCount } = request;
  const compute = (): Output => {
    H.integer(vertices, 0);
    H.integer(parentEdges, 0);
    H.integer(rootCount, 0, vertices);
    return {
      expectedParentEdges: vertices - rootCount,
      deficit: vertices - rootCount - parentEdges,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vertices: 10, parentEdges: 7, rootCount: 1 },
  output: { expectedParentEdges: 9, deficit: 2 },
} satisfies ToolExample<Input, Output>;
export const treeParentEdgeDeficitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/tree-parent-edge-deficit",
    title: "Tree Parent Edge Deficit Tool",
    description:
      "Compare supplied rooted-forest cardinality witnesses; edge counts alone do not prove a tree or forest.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vertices: { type: "integer", minimum: 0 },
        parentEdges: { type: "integer", minimum: 0 },
        rootCount: { type: "integer", minimum: 0 },
      },
      required: ["vertices", "parentEdges", "rootCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedParentEdges: { type: "integer" },
        deficit: { type: "integer" },
      },
      required: ["expectedParentEdges", "deficit"],
    },
    ports: {
      inputs: [
        {
          id: "vertices",
          label: "Vertices",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "parentEdges",
          label: "Parent Edges",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rootCount",
          label: "Root Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "expectedParentEdges",
          label: "Expected Parent Edges",
          valueType: { type: "integer" },
        },
        { id: "deficit", label: "Deficit", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = treeParentEdgeDeficitTool.execute;
export default treeParentEdgeDeficitTool;
