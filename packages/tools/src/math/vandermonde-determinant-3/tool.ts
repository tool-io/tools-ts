import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch-shared.js";
export type Input = Readonly<{ readonly nodes: readonly number[] }>;
export type Output = Readonly<{
  readonly vandermondeDeterminant: number;
  readonly distinctNodes: boolean;
}>;
const inputFields = [
  { id: "nodes", label: "Nodes", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.nodes.length !== 3)
    simpleError("nodes", "Three finite Vandermonde nodes required.");
  const [a, b, c] = input.nodes;
  return {
    vandermondeDeterminant: (b - a) * (c - a) * (c - b),
    distinctNodes: new Set(input.nodes).size === 3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { nodes: [1, 2, 4] } satisfies Input;
export const exampleOutput = {
  vandermondeDeterminant: 6,
  distinctNodes: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/vandermonde-determinant-3",
  title: "Vandermonde Determinant 3 Calculator",
  description:
    "Compute oriented determinant of rows [1,x,x²] from three nodes without requiring caller prebuilt matrix; repeated nodes yield exact singular result.",
  inputs: inputFields,
  outputs: [
    {
      id: "vandermondeDeterminant",
      label: "Vandermonde determinant",
      kind: "number",
    },
    { id: "distinctNodes", label: "Distinct nodes", kind: "boolean" },
  ],
  calculate: (value) => calculate({ nodes: value.nodes as readonly number[] }),
});
export const run = tool.execute;
export default tool;
