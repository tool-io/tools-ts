import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly total: number;
  readonly fixed: number;
  readonly firstWeight: number;
  readonly secondWeight: number;
};
export type Output = { readonly first: number; readonly second: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "number", minimum: 0 },
    fixed: { type: "number", minimum: 0 },
    firstWeight: { type: "number", minimum: 0 },
    secondWeight: { type: "number", minimum: 0 },
  },
  required: ["total", "fixed", "firstWeight", "secondWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { first: { type: "number" }, second: { type: "number" } },
  required: ["first", "second"],
} as const;
/** Calculate three share fixed component rebalance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { total, fixed, firstWeight, secondWeight } = request;
  const compute = (): Output => {
    H.domain(
      total >= 0 &&
        fixed >= 0 &&
        fixed <= total &&
        firstWeight >= 0 &&
        secondWeight >= 0,
    );
    H.positive(firstWeight + secondWeight);
    const remaining = total - fixed,
      first = (remaining * firstWeight) / (firstWeight + secondWeight);
    return { first, second: remaining - first };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { total: 100, fixed: 20, firstWeight: 1, secondWeight: 3 },
  output: { first: 20, second: 60 },
} satisfies ToolExample<Input, Output>;
export const threeShareFixedComponentRebalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/three-share-fixed-component-rebalance",
    title: "Three Share Fixed Component Rebalance Tool",
    description:
      "Calculate three share fixed component rebalance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        total: { type: "number", minimum: 0 },
        fixed: { type: "number", minimum: 0 },
        firstWeight: { type: "number", minimum: 0 },
        secondWeight: { type: "number", minimum: 0 },
      },
      required: ["total", "fixed", "firstWeight", "secondWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { first: { type: "number" }, second: { type: "number" } },
      required: ["first", "second"],
    },
    ports: {
      inputs: [
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixed",
          label: "Fixed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstWeight",
          label: "First Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondWeight",
          label: "Second Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "first", label: "First", valueType: { type: "number" } },
        { id: "second", label: "Second", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = threeShareFixedComponentRebalanceTool.execute;
export default threeShareFixedComponentRebalanceTool;
