import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nodes: readonly number[];
  readonly index: number;
};
export type Output = { readonly coefficient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodes: { type: "array", maxItems: 256, items: { type: "number" } },
    index: { type: "integer", minimum: 0 },
  },
  required: ["nodes", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coefficient: { type: "number" } },
  required: ["coefficient"],
} as const;
/** Calculate lagrange basis leading coefficient from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { nodes, index } = input;
  const compute = (): Output => {
    H.integer(index, 0, nodes.length - 1);
    H.domain(new Set(nodes).size === nodes.length);
    return {
      coefficient:
        1 /
        nodes.reduce(
          (p, x, i) => (i === index ? p : p * (nodes[index] - x)),
          1,
        ),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { nodes: [0, 1, 2], index: 1 },
  output: { coefficient: -1 },
} satisfies ToolExample<Input, Output>;
export const lagrangeBasisLeadingCoefficientTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/lagrange-basis-leading-coefficient",
    title: "Lagrange Basis Leading Coefficient Tool",
    description:
      "Calculate lagrange basis leading coefficient from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nodes: { type: "array", maxItems: 256, items: { type: "number" } },
        index: { type: "integer", minimum: 0 },
      },
      required: ["nodes", "index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coefficient: { type: "number" } },
      required: ["coefficient"],
    },
    ports: {
      inputs: [
        {
          id: "nodes",
          label: "Nodes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "coefficient",
          label: "Coefficient",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lagrangeBasisLeadingCoefficientTool.execute;
export default lagrangeBasisLeadingCoefficientTool;
