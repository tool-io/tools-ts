import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly source: string; readonly target: string };
export type Output = { readonly sum: number; readonly nonzeroEntries: number };
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
  properties: { sum: { type: "integer" }, nonzeroEntries: { type: "integer" } },
  required: ["sum", "nonzeroEntries"],
} as const;
/** Use oriented incidence -1 at the source and +1 at the target, including cancellation for a loop. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { source, target } = request;
  const compute = (): Output => {
    return { sum: 0, nonzeroEntries: source === target ? 0 : 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { source: "a", target: "b" },
  output: { sum: 0, nonzeroEntries: 2 },
} satisfies ToolExample<Input, Output>;
export const directedEdgeIncidenceColumnSumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/directed-edge-incidence-column-sum",
    title: "Directed Edge Incidence Column Sum Tool",
    description:
      "Use oriented incidence -1 at the source and +1 at the target, including cancellation for a loop.",
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
        sum: { type: "integer" },
        nonzeroEntries: { type: "integer" },
      },
      required: ["sum", "nonzeroEntries"],
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
        { id: "sum", label: "Sum", valueType: { type: "integer" } },
        {
          id: "nonzeroEntries",
          label: "Nonzero Entries",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = directedEdgeIncidenceColumnSumTool.execute;
export default directedEdgeIncidenceColumnSumTool;
