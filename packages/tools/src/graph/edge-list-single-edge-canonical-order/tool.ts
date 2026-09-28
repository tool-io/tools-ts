import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly source: string; readonly target: string };
export type Output = {
  readonly source: string;
  readonly target: string;
  readonly reversed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "string", maxLength: 8192 },
    target: { type: "string", maxLength: 8192 },
  },
  required: ["source", "target"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "string", maxLength: 8192 },
    target: { type: "string", maxLength: 8192 },
    reversed: { type: "boolean" },
  },
  required: ["source", "target", "reversed"],
} as const;
/** Calculate edge list single edge canonical order from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { source, target } = request;
  const compute = (): Output => {
    const reversed = source > target;
    return {
      source: reversed ? target : source,
      target: reversed ? source : target,
      reversed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { source: "z", target: "a" },
  output: { source: "a", target: "z", reversed: true },
} satisfies ToolExample<Input, Output>;
export const edgeListSingleEdgeCanonicalOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/edge-list-single-edge-canonical-order",
    title: "Edge List Single Edge Canonical Order Tool",
    description:
      "Calculate edge list single edge canonical order from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        source: { type: "string", maxLength: 8192 },
        target: { type: "string", maxLength: 8192 },
      },
      required: ["source", "target"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        source: { type: "string", maxLength: 8192 },
        target: { type: "string", maxLength: 8192 },
        reversed: { type: "boolean" },
      },
      required: ["source", "target", "reversed"],
    },
    ports: {
      inputs: [
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "source", label: "Source", valueType: { type: "string" } },
        { id: "target", label: "Target", valueType: { type: "string" } },
        { id: "reversed", label: "Reversed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = edgeListSingleEdgeCanonicalOrderTool.execute;
export default edgeListSingleEdgeCanonicalOrderTool;
