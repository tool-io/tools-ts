import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly count: number; readonly index: number };
export type Output = { readonly role: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 2 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["count", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { role: { type: "string", maxLength: 8192 } },
  required: ["role"],
} as const;
/** Calculate linestring vertex index endpoint role from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, index } = request;
  const compute = (): Output => {
    H.integer(count, 2);
    H.integer(index, 0, count - 1);
    return {
      role: index === 0 ? "start" : index === count - 1 ? "end" : "interior",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 5, index: 2 },
  output: { role: "interior" },
} satisfies ToolExample<Input, Output>;
export const linestringVertexIndexEndpointRoleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/linestring-vertex-index-endpoint-role",
    title: "Linestring Vertex Index Endpoint Role Tool",
    description:
      "Calculate linestring vertex index endpoint role from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 2 },
        index: { type: "integer", minimum: 0 },
      },
      required: ["count", "index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { role: { type: "string", maxLength: 8192 } },
      required: ["role"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "role", label: "Role", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = linestringVertexIndexEndpointRoleTool.execute;
export default linestringVertexIndexEndpointRoleTool;
