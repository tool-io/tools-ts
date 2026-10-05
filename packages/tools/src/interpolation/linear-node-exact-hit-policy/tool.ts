import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly query: number;
  readonly leftNode: number;
  readonly rightNode: number;
  readonly leftValue: number;
  readonly rightValue: number;
};
export type Output = { readonly exactHit: boolean; readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    query: { type: "number" },
    leftNode: { type: "number" },
    rightNode: { type: "number" },
    leftValue: { type: "number" },
    rightValue: { type: "number" },
  },
  required: ["query", "leftNode", "rightNode", "leftValue", "rightValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { exactHit: { type: "boolean" }, value: { type: "number" } },
  required: ["exactHit", "value"],
} as const;
/** Interpolate in a strictly increasing two-node bracket while returning the supplied endpoint value exactly on a node hit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { query, leftNode, rightNode, leftValue, rightValue } = request;
  const compute = (): Output => {
    H.domain(
      leftNode < rightNode && query >= leftNode && query <= rightNode,
      "leftNode",
    );
    return {
      exactHit: query === leftNode || query === rightNode,
      value:
        query === leftNode
          ? leftValue
          : query === rightNode
            ? rightValue
            : leftValue +
              ((query - leftNode) / (rightNode - leftNode)) *
                (rightValue - leftValue),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { query: 4, leftNode: 2, rightNode: 4, leftValue: 7, rightValue: 10 },
  output: { exactHit: true, value: 10 },
} satisfies ToolExample<Input, Output>;
export const linearNodeExactHitPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/linear-node-exact-hit-policy",
    title: "Linear Node Exact Hit Policy Tool",
    description:
      "Interpolate in a strictly increasing two-node bracket while returning the supplied endpoint value exactly on a node hit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: { type: "number" },
        leftNode: { type: "number" },
        rightNode: { type: "number" },
        leftValue: { type: "number" },
        rightValue: { type: "number" },
      },
      required: ["query", "leftNode", "rightNode", "leftValue", "rightValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { exactHit: { type: "boolean" }, value: { type: "number" } },
      required: ["exactHit", "value"],
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
        {
          id: "leftValue",
          label: "Left Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightValue",
          label: "Right Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "exactHit", label: "Exact Hit", valueType: { type: "boolean" } },
        { id: "value", label: "Value", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = linearNodeExactHitPolicyTool.execute;
export default linearNodeExactHitPolicyTool;
