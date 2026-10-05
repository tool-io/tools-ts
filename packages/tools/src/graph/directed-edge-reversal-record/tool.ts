import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly edgeId: string;
  readonly sourceId: string;
  readonly targetId: string;
};
export type Output = {
  readonly edgeId: string;
  readonly sourceId: string;
  readonly targetId: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeId: { type: "string", maxLength: 8192 },
    sourceId: { type: "string", maxLength: 8192 },
    targetId: { type: "string", maxLength: 8192 },
  },
  required: ["edgeId", "sourceId", "targetId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeId: { type: "string", maxLength: 8192 },
    sourceId: { type: "string", maxLength: 8192 },
    targetId: { type: "string", maxLength: 8192 },
  },
  required: ["edgeId", "sourceId", "targetId"],
} as const;
/** Reverse one directed edge while preserving its explicit edge identifier. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { edgeId, sourceId, targetId } = request;
  const compute = (): Output => {
    H.domain(
      edgeId.length > 0 && sourceId.length > 0 && targetId.length > 0,
      "edgeId",
    );
    return { edgeId, sourceId: targetId, targetId: sourceId };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { edgeId: "e7", sourceId: "A", targetId: "B" },
  output: { edgeId: "e7", sourceId: "B", targetId: "A" },
} satisfies ToolExample<Input, Output>;
export const directedEdgeReversalRecordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/directed-edge-reversal-record",
    title: "Directed Edge Reversal Record Tool",
    description:
      "Reverse one directed edge while preserving its explicit edge identifier.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgeId: { type: "string", maxLength: 8192 },
        sourceId: { type: "string", maxLength: 8192 },
        targetId: { type: "string", maxLength: 8192 },
      },
      required: ["edgeId", "sourceId", "targetId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgeId: { type: "string", maxLength: 8192 },
        sourceId: { type: "string", maxLength: 8192 },
        targetId: { type: "string", maxLength: 8192 },
      },
      required: ["edgeId", "sourceId", "targetId"],
    },
    ports: {
      inputs: [
        {
          id: "edgeId",
          label: "Edge Id",
          required: true,
          valueType: { type: "string" },
        },
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
        { id: "edgeId", label: "Edge Id", valueType: { type: "string" } },
        { id: "sourceId", label: "Source Id", valueType: { type: "string" } },
        { id: "targetId", label: "Target Id", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = directedEdgeReversalRecordTool.execute;
export default directedEdgeReversalRecordTool;
