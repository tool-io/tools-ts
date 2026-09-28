import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly edgeSigns: readonly number[] };
export type Output = { readonly reversedSigns: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeSigns: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["edgeSigns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reversedSigns: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["reversedSigns"],
} as const;
/** Calculate graph path reversal oriented edge sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { edgeSigns } = request;
  const compute = (): Output => {
    H.domain(edgeSigns.every((x) => x === 1 || x === -1));
    return { reversedSigns: [...edgeSigns].reverse().map((x) => -x) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { edgeSigns: [1, -1, 1] },
  output: { reversedSigns: [-1, 1, -1] },
} satisfies ToolExample<Input, Output>;
export const graphPathReversalOrientedEdgeSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/graph-path-reversal-oriented-edge-sign",
    title: "Graph Path Reversal Oriented Edge Sign Tool",
    description:
      "Calculate graph path reversal oriented edge sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgeSigns: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["edgeSigns"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reversedSigns: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["reversedSigns"],
    },
    ports: {
      inputs: [
        {
          id: "edgeSigns",
          label: "Edge Signs",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "reversedSigns",
          label: "Reversed Signs",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = graphPathReversalOrientedEdgeSignTool.execute;
export default graphPathReversalOrientedEdgeSignTool;
