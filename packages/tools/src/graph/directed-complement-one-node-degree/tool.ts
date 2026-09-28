import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nodes: number;
  readonly outDegree: number;
  readonly inDegree: number;
};
export type Output = { readonly outDegree: number; readonly inDegree: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodes: { type: "integer", minimum: 1 },
    outDegree: { type: "integer", minimum: 0 },
    inDegree: { type: "integer", minimum: 0 },
  },
  required: ["nodes", "outDegree", "inDegree"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outDegree: { type: "integer" }, inDegree: { type: "integer" } },
  required: ["outDegree", "inDegree"],
} as const;
/** Calculate directed complement one node degree from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nodes, outDegree, inDegree } = request;
  const compute = (): Output => {
    H.integer(nodes, 1);
    H.integer(outDegree, 0, nodes - 1);
    H.integer(inDegree, 0, nodes - 1);
    return { outDegree: nodes - 1 - outDegree, inDegree: nodes - 1 - inDegree };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nodes: 6, outDegree: 2, inDegree: 3 },
  output: { outDegree: 3, inDegree: 2 },
} satisfies ToolExample<Input, Output>;
export const directedComplementOneNodeDegreeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/directed-complement-one-node-degree",
    title: "Directed Complement One Node Degree Tool",
    description:
      "Calculate directed complement one node degree from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nodes: { type: "integer", minimum: 1 },
        outDegree: { type: "integer", minimum: 0 },
        inDegree: { type: "integer", minimum: 0 },
      },
      required: ["nodes", "outDegree", "inDegree"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outDegree: { type: "integer" },
        inDegree: { type: "integer" },
      },
      required: ["outDegree", "inDegree"],
    },
    ports: {
      inputs: [
        {
          id: "nodes",
          label: "Nodes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "outDegree",
          label: "Out Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inDegree",
          label: "In Degree",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "outDegree",
          label: "Out Degree",
          valueType: { type: "integer" },
        },
        { id: "inDegree", label: "In Degree", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = directedComplementOneNodeDegreeTool.execute;
export default directedComplementOneNodeDegreeTool;
