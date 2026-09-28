import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { calculate as joinDegree } from "../graph-join-one-node-degree-increment/tool.js";
export type Input = {
  readonly originalDegree: number;
  readonly originalOrder: number;
  readonly isolatedGroupSize: number;
};
export type Output = {
  readonly originalVertexDegree: number;
  readonly addedVertexDegree: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalDegree: { type: "integer", minimum: 0 },
    originalOrder: { type: "integer", minimum: 1 },
    isolatedGroupSize: { type: "integer", minimum: 1 },
  },
  required: ["originalDegree", "originalOrder", "isolatedGroupSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalVertexDegree: { type: "integer" },
    addedVertexDegree: { type: "integer" },
  },
  required: ["originalVertexDegree", "addedVertexDegree"],
} as const;
/** Degree shift when joining a supplied simple graph to an independent group of isolated vertices. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalDegree, originalOrder, isolatedGroupSize } = request;
  const compute = (): Output => {
    H.integer(originalOrder, 1);
    H.integer(originalDegree, 0, originalOrder - 1);
    H.integer(isolatedGroupSize, 1);
    return {
      originalVertexDegree: joinDegree({
        degree: originalDegree,
        otherVertices: isolatedGroupSize,
      }).degree,
      addedVertexDegree: joinDegree({ degree: 0, otherVertices: originalOrder })
        .degree,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalDegree: 2, originalOrder: 5, isolatedGroupSize: 3 },
  output: { originalVertexDegree: 5, addedVertexDegree: 5 },
} satisfies ToolExample<Input, Output>;
export const graphJoinIsolatedNodeDegreeShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/graph-join-isolated-node-degree-shift",
    title: "Graph Join Isolated Node Degree Shift Tool",
    description:
      "Degree shift when joining a supplied simple graph to an independent group of isolated vertices.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalDegree: { type: "integer", minimum: 0 },
        originalOrder: { type: "integer", minimum: 1 },
        isolatedGroupSize: { type: "integer", minimum: 1 },
      },
      required: ["originalDegree", "originalOrder", "isolatedGroupSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalVertexDegree: { type: "integer" },
        addedVertexDegree: { type: "integer" },
      },
      required: ["originalVertexDegree", "addedVertexDegree"],
    },
    ports: {
      inputs: [
        {
          id: "originalDegree",
          label: "Original Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "originalOrder",
          label: "Original Order",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "isolatedGroupSize",
          label: "Isolated Group Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "originalVertexDegree",
          label: "Original Vertex Degree",
          valueType: { type: "integer" },
        },
        {
          id: "addedVertexDegree",
          label: "Added Vertex Degree",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = graphJoinIsolatedNodeDegreeShiftTool.execute;
export default graphJoinIsolatedNodeDegreeShiftTool;
