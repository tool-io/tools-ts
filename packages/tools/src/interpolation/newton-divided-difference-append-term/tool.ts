import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coefficient: number;
  readonly x: number;
  readonly nodes: readonly number[];
};
export type Output = { readonly term: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficient: { type: "number" },
    x: { type: "number" },
    nodes: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["coefficient", "x", "nodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { term: { type: "number" } },
  required: ["term"],
} as const;
/** Calculate newton divided difference append term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { coefficient, x, nodes } = input;
  const compute = (): Output => {
    return { term: coefficient * nodes.reduce((p, node) => p * (x - node), 1) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coefficient: 2, x: 3, nodes: [0, 1] },
  output: { term: 12 },
} satisfies ToolExample<Input, Output>;
export const newtonDividedDifferenceAppendTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/newton-divided-difference-append-term",
    title: "Newton Divided Difference Append Term Tool",
    description:
      "Calculate newton divided difference append term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coefficient: { type: "number" },
        x: { type: "number" },
        nodes: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["coefficient", "x", "nodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { term: { type: "number" } },
      required: ["term"],
    },
    ports: {
      inputs: [
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        {
          id: "nodes",
          label: "Nodes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [{ id: "term", label: "Term", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = newtonDividedDifferenceAppendTermTool.execute;
export default newtonDividedDifferenceAppendTermTool;
