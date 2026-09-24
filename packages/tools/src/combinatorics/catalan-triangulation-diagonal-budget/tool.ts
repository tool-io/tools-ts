import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly vertices: number };
export type Output = { readonly diagonals: number; readonly triangles: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { vertices: { type: "integer", minimum: 3 } },
  required: ["vertices"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diagonals: { type: "integer" },
    triangles: { type: "integer" },
  },
  required: ["diagonals", "triangles"],
} as const;
/** Calculate catalan triangulation diagonal budget from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { vertices } = input;
  const compute = (): Output => {
    H.integer(vertices, 3);
    return { diagonals: vertices - 3, triangles: vertices - 2 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { vertices: 6 },
  output: { diagonals: 3, triangles: 4 },
} satisfies ToolExample<Input, Output>;
export const catalanTriangulationDiagonalBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/catalan-triangulation-diagonal-budget",
    title: "Catalan Triangulation Diagonal Budget Tool",
    description:
      "Calculate catalan triangulation diagonal budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { vertices: { type: "integer", minimum: 3 } },
      required: ["vertices"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diagonals: { type: "integer" },
        triangles: { type: "integer" },
      },
      required: ["diagonals", "triangles"],
    },
    ports: {
      inputs: [
        {
          id: "vertices",
          label: "Vertices",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "diagonals", label: "Diagonals", valueType: { type: "integer" } },
        { id: "triangles", label: "Triangles", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = catalanTriangulationDiagonalBudgetTool.execute;
export default catalanTriangulationDiagonalBudgetTool;
