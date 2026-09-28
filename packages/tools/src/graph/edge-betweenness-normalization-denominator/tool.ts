import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly vertices: number; readonly directed: boolean };
export type Output = { readonly pairs: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertices: { type: "integer", minimum: 2, maximum: 1000000 },
    directed: { type: "boolean" },
  },
  required: ["vertices", "directed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pairs: { type: "number" } },
  required: ["pairs"],
} as const;
/** Compute edge betweenness normalization denominator from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { vertices, directed } = input;
  const compute = (): Output => {
    integer(vertices, 2, 1000000);
    return { pairs: (vertices * (vertices - 1)) / (directed ? 1 : 2) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { vertices: 4, directed: false },
  output: { pairs: 6 },
} satisfies ToolExample<Input, Output>;
export const edgeBetweennessNormalizationDenominatorTool =
  defineSchemaCalculation<Input, Output>({
    id: "graph/edge-betweenness-normalization-denominator",
    title: "Edge Betweenness Normalization Denominator Tool",
    description:
      "Compute edge betweenness normalization denominator from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "vertices",
          label: "Vertices",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "directed",
          label: "Directed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "pairs", label: "Pairs", valueType: { type: "number" } }],
    },
  });
export const run = edgeBetweennessNormalizationDenominatorTool.execute;
export default edgeBetweennessNormalizationDenominatorTool;
