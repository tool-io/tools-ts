import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly edges: number; readonly uniformity: number };
export type Output = { readonly incidences: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edges: { type: "integer", minimum: 0 },
    uniformity: { type: "integer", minimum: 1 },
  },
  required: ["edges", "uniformity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { incidences: { type: "integer" } },
  required: ["incidences"],
} as const;
/** Calculate hypergraph uniform edge incidence count from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { edges, uniformity } = input;
  const compute = (): Output => {
    H.integer(edges, 0);
    H.integer(uniformity, 1);
    return { incidences: edges * uniformity };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { edges: 7, uniformity: 3 },
  output: { incidences: 21 },
} satisfies ToolExample<Input, Output>;
export const hypergraphUniformEdgeIncidenceCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "combinatorics/hypergraph-uniform-edge-incidence-count",
      title: "Hypergraph Uniform Edge Incidence Count Tool",
      description:
        "Calculate hypergraph uniform edge incidence count from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          edges: { type: "integer", minimum: 0 },
          uniformity: { type: "integer", minimum: 1 },
        },
        required: ["edges", "uniformity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { incidences: { type: "integer" } },
        required: ["incidences"],
      },
      ports: {
        inputs: [
          {
            id: "edges",
            label: "Edges",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "uniformity",
            label: "Uniformity",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "incidences",
            label: "Incidences",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hypergraphUniformEdgeIncidenceCountTool.execute;
export default hypergraphUniformEdgeIncidenceCountTool;
