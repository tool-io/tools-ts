import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sourceId: string; readonly targetId: string };
export type Output = { readonly selfLoop: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192 },
    targetId: { type: "string", maxLength: 8192 },
  },
  required: ["sourceId", "targetId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { selfLoop: { type: "boolean" } },
  required: ["selfLoop"],
} as const;
/** Check whether one graph edge is a self-loop by exact, case-sensitive endpoint identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, targetId } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0 && targetId.length > 0, "sourceId");
    return { selfLoop: sourceId === targetId };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceId: "node-A", targetId: "node-A" },
  output: { selfLoop: true },
} satisfies ToolExample<Input, Output>;
export const edgeLoopEndpointCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/edge-loop-endpoint-check",
    title: "Edge Loop Endpoint Check Tool",
    description:
      "Check whether one graph edge is a self-loop by exact, case-sensitive endpoint identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192 },
        targetId: { type: "string", maxLength: 8192 },
      },
      required: ["sourceId", "targetId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { selfLoop: { type: "boolean" } },
      required: ["selfLoop"],
    },
    ports: {
      inputs: [
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetId",
          label: "Target Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "selfLoop", label: "Self Loop", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = edgeLoopEndpointCheckTool.execute;
export default edgeLoopEndpointCheckTool;
