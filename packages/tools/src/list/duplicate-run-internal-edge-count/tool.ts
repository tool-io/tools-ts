import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly runLengths: readonly number[] };
export type Output = { readonly internalEdges: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    runLengths: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["runLengths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { internalEdges: { type: "integer" } },
  required: ["internalEdges"],
} as const;
/** Count adjacent equal-value edges from explicit maximal duplicate-run lengths. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { runLengths } = request;
  const compute = (): Output => {
    H.domain(runLengths.every((n) => n >= 1));
    return {
      internalEdges: Number(
        runLengths.reduce((s, n) => s + BigInt(n) - 1n, 0n),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { runLengths: [3, 1, 2] },
  output: { internalEdges: 3 },
} satisfies ToolExample<Input, Output>;
export const duplicateRunInternalEdgeCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/duplicate-run-internal-edge-count",
    title: "Duplicate Run Internal Edge Count Tool",
    description:
      "Count adjacent equal-value edges from explicit maximal duplicate-run lengths.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        runLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["runLengths"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { internalEdges: { type: "integer" } },
      required: ["internalEdges"],
    },
    ports: {
      inputs: [
        {
          id: "runLengths",
          label: "Run Lengths",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "internalEdges",
          label: "Internal Edges",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = duplicateRunInternalEdgeCountTool.execute;
export default duplicateRunInternalEdgeCountTool;
