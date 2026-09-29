import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weight: number;
  readonly node: number;
  readonly deletedNode: number;
};
export type Output = { readonly newWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weight: { type: "number" },
    node: { type: "number" },
    deletedNode: { type: "number" },
  },
  required: ["weight", "node", "deletedNode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newWeight: { type: "number" } },
  required: ["newWeight"],
} as const;
/** Calculate barycentric weight node deletion factor from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { weight, node, deletedNode } = input;
  const compute = (): Output => {
    H.domain(node !== deletedNode);
    return { newWeight: weight * (node - deletedNode) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { weight: 0.5, node: 2, deletedNode: 4 },
  output: { newWeight: -1 },
} satisfies ToolExample<Input, Output>;
export const barycentricWeightNodeDeletionFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "interpolation/barycentric-weight-node-deletion-factor",
      title: "Barycentric Weight Node Deletion Factor Tool",
      description:
        "Calculate barycentric weight node deletion factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weight: { type: "number" },
          node: { type: "number" },
          deletedNode: { type: "number" },
        },
        required: ["weight", "node", "deletedNode"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { newWeight: { type: "number" } },
        required: ["newWeight"],
      },
      ports: {
        inputs: [
          {
            id: "weight",
            label: "Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "node",
            label: "Node",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deletedNode",
            label: "Deleted Node",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "newWeight",
            label: "New Weight",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = barycentricWeightNodeDeletionFactorTool.execute;
export default barycentricWeightNodeDeletionFactorTool;
