import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly vertices: number; readonly edges: number };
export type Output = {
  readonly residual: number;
  readonly compatible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertices: { type: "integer", minimum: 1 },
    edges: { type: "integer", minimum: 0 },
  },
  required: ["vertices", "edges"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "integer" },
    compatible: { type: "boolean" },
  },
  required: ["residual", "compatible"],
} as const;
/** Check the necessary edge/vertex count identity for a nonempty tree; counts alone do not prove connectivity. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { vertices, edges } = input;
  const compute = (): Output => {
    H.integer(vertices, 1);
    H.integer(edges, 0);
    const residual = edges - vertices + 1;
    return { residual, compatible: residual === 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { vertices: 7, edges: 6 },
  output: { residual: 0, compatible: true },
} satisfies ToolExample<Input, Output>;
export const planeTreeEdgeVertexBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/plane-tree-edge-vertex-balance",
    title: "Plane Tree Edge Vertex Balance Tool",
    description:
      "Check the necessary edge/vertex count identity for a nonempty tree; counts alone do not prove connectivity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vertices: { type: "integer", minimum: 1 },
        edges: { type: "integer", minimum: 0 },
      },
      required: ["vertices", "edges"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residual: { type: "integer" },
        compatible: { type: "boolean" },
      },
      required: ["residual", "compatible"],
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
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "integer" } },
        {
          id: "compatible",
          label: "Compatible",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = planeTreeEdgeVertexBalanceTool.execute;
export default planeTreeEdgeVertexBalanceTool;
