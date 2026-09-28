import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly degree: number; readonly root: boolean };
export type Output = { readonly children: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degree: { type: "integer", minimum: 0 },
    root: { type: "boolean" },
  },
  required: ["degree", "root"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { children: { type: "integer" } },
  required: ["children"],
} as const;
/** Compute tree root nonroot child degree budget from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { degree, root } = input;
  const compute = (): Output => {
    integer(degree);
    domain(root || degree >= 1);
    return { children: degree - (root ? 0 : 1) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { degree: 3, root: false },
  output: { children: 2 },
} satisfies ToolExample<Input, Output>;
export const treeRootNonrootChildDegreeBudgetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "graph/tree-root-nonroot-child-degree-budget",
  title: "Tree Root Nonroot Child Degree Budget Tool",
  description:
    "Compute tree root nonroot child degree budget from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "degree",
        label: "Degree",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "root",
        label: "Root",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "children", label: "Children", valueType: { type: "integer" } },
    ],
  },
});
export const run = treeRootNonrootChildDegreeBudgetTool.execute;
export default treeRootNonrootChildDegreeBudgetTool;
