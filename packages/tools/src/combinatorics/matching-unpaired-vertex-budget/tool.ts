import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly vertices: number; readonly edges: number };
export type Output = { readonly unpaired: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertices: { type: "integer", minimum: 0 },
    edges: { type: "integer", minimum: 0 },
  },
  required: ["vertices", "edges"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unpaired: { type: "integer" } },
  required: ["unpaired"],
} as const;
/** Calculate matching unpaired vertex budget from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { vertices, edges } = input;
  const compute = (): Output => {
    H.integer(vertices, 0);
    H.integer(edges, 0, Math.floor(vertices / 2));
    return { unpaired: vertices - 2 * edges };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { vertices: 9, edges: 3 },
  output: { unpaired: 3 },
} satisfies ToolExample<Input, Output>;
export const matchingUnpairedVertexBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/matching-unpaired-vertex-budget",
    title: "Matching Unpaired Vertex Budget Tool",
    description:
      "Calculate matching unpaired vertex budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vertices: { type: "integer", minimum: 0 },
        edges: { type: "integer", minimum: 0 },
      },
      required: ["vertices", "edges"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unpaired: { type: "integer" } },
      required: ["unpaired"],
    },
    ports: {
      inputs: [
        {
          id: "vertices",
          label: "Vertices",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "edges",
          label: "Edges",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "unpaired", label: "Unpaired", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = matchingUnpairedVertexBudgetTool.execute;
export default matchingUnpairedVertexBudgetTool;
