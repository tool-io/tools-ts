import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly x: number;
  readonly nodes: readonly number[];
  readonly values: readonly number[];
  readonly observed: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    nodes: { type: "array", maxItems: 256, items: { type: "number" } },
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    observed: { type: "number" },
  },
  required: ["x", "nodes", "values", "observed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Compute quadratic interpolant one node residual from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { x, nodes, values, observed } = input;
  const compute = (): Output => {
    domain(
      nodes.length === 3 && values.length === 3 && new Set(nodes).size === 3,
    );
    const y = nodes.reduce(
      (s, xi, i) =>
        s +
        values[i] *
          nodes.reduce(
            (p, xj, j) => (j === i ? p : (p * (x - xj)) / (xi - xj)),
            1,
          ),
      0,
    );
    return { residual: observed - y };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 3, nodes: [0, 1, 2], values: [0, 1, 4], observed: 10 },
  output: { residual: 1 },
} satisfies ToolExample<Input, Output>;
export const quadraticInterpolantOneNodeResidualTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "interpolation/quadratic-interpolant-one-node-residual",
  title: "Quadratic Interpolant One Node Residual Tool",
  description:
    "Compute quadratic interpolant one node residual from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "x", label: "X", required: true, valueType: { type: "number" } },
      {
        id: "nodes",
        label: "Nodes",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "values",
        label: "Values",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "observed",
        label: "Observed",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "residual", label: "Residual", valueType: { type: "number" } },
    ],
  },
});
export const run = quadraticInterpolantOneNodeResidualTool.execute;
export default quadraticInterpolantOneNodeResidualTool;
