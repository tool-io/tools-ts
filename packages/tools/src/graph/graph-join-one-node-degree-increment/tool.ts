import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly degree: number; readonly otherVertices: number };
export type Output = { readonly degree: number; readonly increment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degree: { type: "integer", minimum: 0 },
    otherVertices: { type: "integer", minimum: 0 },
  },
  required: ["degree", "otherVertices"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { degree: { type: "integer" }, increment: { type: "integer" } },
  required: ["degree", "increment"],
} as const;
/** Calculate graph join one node degree increment from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { degree, otherVertices } = request;
  const compute = (): Output => {
    H.integer(degree, 0);
    H.integer(otherVertices, 0);
    return { degree: degree + otherVertices, increment: otherVertices };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { degree: 2, otherVertices: 5 },
  output: { degree: 7, increment: 5 },
} satisfies ToolExample<Input, Output>;
export const graphJoinOneNodeDegreeIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/graph-join-one-node-degree-increment",
    title: "Graph Join One Node Degree Increment Tool",
    description:
      "Calculate graph join one node degree increment from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        degree: { type: "integer", minimum: 0 },
        otherVertices: { type: "integer", minimum: 0 },
      },
      required: ["degree", "otherVertices"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        degree: { type: "integer" },
        increment: { type: "integer" },
      },
      required: ["degree", "increment"],
    },
    ports: {
      inputs: [
        {
          id: "degree",
          label: "Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "otherVertices",
          label: "Other Vertices",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "degree", label: "Degree", valueType: { type: "integer" } },
        { id: "increment", label: "Increment", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = graphJoinOneNodeDegreeIncrementTool.execute;
export default graphJoinOneNodeDegreeIncrementTool;
