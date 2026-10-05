import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly query: number;
  readonly leftNode: number;
  readonly rightNode: number;
};
export type Output = { readonly localCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    query: { type: "number" },
    leftNode: { type: "number" },
    rightNode: { type: "number" },
  },
  required: ["query", "leftNode", "rightNode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { localCoordinate: { type: "number" } },
  required: ["localCoordinate"],
} as const;
/** Return the unit local coordinate of a query inside an increasing interpolation bracket; both endpoints are included. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { query, leftNode, rightNode } = request;
  const compute = (): Output => {
    H.domain(
      leftNode < rightNode && query >= leftNode && query <= rightNode,
      "leftNode",
    );
    return { localCoordinate: (query - leftNode) / (rightNode - leftNode) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { query: 3, leftNode: 2, rightNode: 6 },
  output: { localCoordinate: 0.25 },
} satisfies ToolExample<Input, Output>;
export const linearBracketLocalCoordinateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/linear-bracket-local-coordinate",
    title: "Linear Bracket Local Coordinate Tool",
    description:
      "Return the unit local coordinate of a query inside an increasing interpolation bracket; both endpoints are included.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: { type: "number" },
        leftNode: { type: "number" },
        rightNode: { type: "number" },
      },
      required: ["query", "leftNode", "rightNode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { localCoordinate: { type: "number" } },
      required: ["localCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "query",
          label: "Query",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftNode",
          label: "Left Node",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightNode",
          label: "Right Node",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "localCoordinate",
          label: "Local Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = linearBracketLocalCoordinateTool.execute;
export default linearBracketLocalCoordinateTool;
