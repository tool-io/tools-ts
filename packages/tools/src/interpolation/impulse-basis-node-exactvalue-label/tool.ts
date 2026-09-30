import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly node: number;
  readonly basis: number;
  readonly count: number;
};
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    node: { type: "integer", minimum: 0 },
    basis: { type: "integer", minimum: 0 },
    count: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["node", "basis", "count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" } },
  required: ["value"],
} as const;
/** Calculate impulse basis node exactvalue label from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { node, basis, count } = input;
  const compute = (): Output => {
    H.integer(count, 1, 256);
    H.integer(node, 0, count - 1);
    H.integer(basis, 0, count - 1);
    return { value: node === basis ? 1 : 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { node: 2, basis: 2, count: 4 },
  output: { value: 1 },
} satisfies ToolExample<Input, Output>;
export const impulseBasisNodeExactvalueLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/impulse-basis-node-exactvalue-label",
    title: "Impulse Basis Node Exactvalue Label Tool",
    description:
      "Calculate impulse basis node exactvalue label from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        node: { type: "integer", minimum: 0 },
        basis: { type: "integer", minimum: 0 },
        count: { type: "integer", minimum: 1, maximum: 256 },
      },
      required: ["node", "basis", "count"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "integer" } },
      required: ["value"],
    },
    ports: {
      inputs: [
        {
          id: "node",
          label: "Node",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "basis",
          label: "Basis",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = impulseBasisNodeExactvalueLabelTool.execute;
export default impulseBasisNodeExactvalueLabelTool;
