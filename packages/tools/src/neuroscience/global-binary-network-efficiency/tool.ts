import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, graph, efficiency } from "../shared.js";
export type Input = Readonly<{
  readonly adjacency: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly globalEfficiency: number;
}>;
const inputFields = [
  { id: "adjacency", label: "Adjacency", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  graph(input.adjacency);
  return { globalEfficiency: efficiency(input.adjacency) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  adjacency: [
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
  ],
} satisfies Input;
export const exampleOutput = {
  globalEfficiency: 0.8333333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/global-binary-network-efficiency",
  title: "Global Network Efficiency",
  description:
    "Compute mean reciprocal shortest-path distance over ordered node pairs, assigning disconnected pairs zero contribution in a binary undirected graph.",
  inputs: inputFields,
  outputs: [
    { id: "globalEfficiency", label: "Global efficiency", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      adjacency: value.adjacency as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
