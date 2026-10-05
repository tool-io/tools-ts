import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly vertexCount: number; readonly closed: boolean };
export type Output = { readonly edgeCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertexCount: { type: "integer", minimum: 0 },
    closed: { type: "boolean" },
  },
  required: ["vertexCount", "closed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { edgeCount: { type: "integer" } },
  required: ["edgeCount"],
} as const;
/** Count traversed edges in an open vertex sequence or a closed sequence whose first vertex is not repeated at the end. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vertexCount, closed } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(vertexCount) &&
        vertexCount >= 0 &&
        vertexCount <= Number.MAX_SAFE_INTEGER,
      "vertexCount",
    ),
      vertexCount);
    H.domain(!closed || vertexCount > 0, "vertexCount");
    return { edgeCount: closed ? vertexCount : Math.max(0, vertexCount - 1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vertexCount: 6, closed: false },
  output: { edgeCount: 5 },
} satisfies ToolExample<Input, Output>;
export const pathEdgeCountFromVertexCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/path-edge-count-from-vertex-count",
    title: "Path Edge Count From Vertex Count Tool",
    description:
      "Count traversed edges in an open vertex sequence or a closed sequence whose first vertex is not repeated at the end.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vertexCount: { type: "integer", minimum: 0 },
        closed: { type: "boolean" },
      },
      required: ["vertexCount", "closed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { edgeCount: { type: "integer" } },
      required: ["edgeCount"],
    },
    ports: {
      inputs: [
        {
          id: "vertexCount",
          label: "Vertex Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "closed",
          label: "Closed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "edgeCount",
          label: "Edge Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pathEdgeCountFromVertexCountTool.execute;
export default pathEdgeCountFromVertexCountTool;
