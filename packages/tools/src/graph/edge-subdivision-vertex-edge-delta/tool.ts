import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vertices: number;
  readonly edges: number;
  readonly insertedVertices: number;
};
export type Output = {
  readonly vertices: number;
  readonly edges: number;
  readonly edgeDelta: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertices: { type: "integer", minimum: 2 },
    edges: { type: "integer", minimum: 1 },
    insertedVertices: { type: "integer", minimum: 0 },
  },
  required: ["vertices", "edges", "insertedVertices"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertices: { type: "integer" },
    edges: { type: "integer" },
    edgeDelta: { type: "integer" },
  },
  required: ["vertices", "edges", "edgeDelta"],
} as const;
/** Calculate edge subdivision vertex edge delta from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vertices, edges, insertedVertices } = request;
  const compute = (): Output => {
    H.integer(vertices, 2);
    H.integer(edges, 1);
    H.integer(insertedVertices, 0);
    return {
      vertices: vertices + insertedVertices,
      edges: edges + insertedVertices,
      edgeDelta: insertedVertices,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vertices: 5, edges: 6, insertedVertices: 2 },
  output: { vertices: 7, edges: 8, edgeDelta: 2 },
} satisfies ToolExample<Input, Output>;
export const edgeSubdivisionVertexEdgeDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/edge-subdivision-vertex-edge-delta",
    title: "Edge Subdivision Vertex Edge Delta Tool",
    description:
      "Calculate edge subdivision vertex edge delta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vertices: { type: "integer", minimum: 2 },
        edges: { type: "integer", minimum: 1 },
        insertedVertices: { type: "integer", minimum: 0 },
      },
      required: ["vertices", "edges", "insertedVertices"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vertices: { type: "integer" },
        edges: { type: "integer" },
        edgeDelta: { type: "integer" },
      },
      required: ["vertices", "edges", "edgeDelta"],
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
          id: "edges",
          label: "Edges",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "insertedVertices",
          label: "Inserted Vertices",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "vertices", label: "Vertices", valueType: { type: "integer" } },
        { id: "edges", label: "Edges", valueType: { type: "integer" } },
        {
          id: "edgeDelta",
          label: "Edge Delta",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = edgeSubdivisionVertexEdgeDeltaTool.execute;
export default edgeSubdivisionVertexEdgeDeltaTool;
