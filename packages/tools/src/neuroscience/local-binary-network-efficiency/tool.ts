import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import { validateInput, finish, mean, graph, efficiency } from "../shared.js";
export type Input = Readonly<{
  readonly adjacency: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly nodeLocalEfficiencies: readonly number[];
  readonly meanLocalEfficiency: number;
}>;
const inputFields = [
  { id: "adjacency", label: "Adjacency", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = graph(input.adjacency),
    nodeLocalEfficiencies: number[] = [];
  if (n > 32)
    simpleError(
      "adjacency",
      "Local induced-subgraph efficiency is bounded to 32 nodes.",
    );
  for (let i = 0; i < n; i++) {
    const neighbors = input.adjacency[i].flatMap((v, j) => (v ? [j] : []));
    nodeLocalEfficiencies.push(
      neighbors.length < 2
        ? 0
        : efficiency(
            neighbors.map((a) => neighbors.map((b) => input.adjacency[a][b])),
          ),
    );
  }
  return {
    nodeLocalEfficiencies,
    meanLocalEfficiency: mean(nodeLocalEfficiencies),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  adjacency: [
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 0],
  ],
} satisfies Input;
export const exampleOutput = {
  nodeLocalEfficiencies: [1, 1, 1],
  meanLocalEfficiency: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/local-binary-network-efficiency",
  title: "Local Network Efficiency",
  description:
    "Calculate efficiency within each node’s induced neighbor subgraph for 2–32 nodes; degree<2 nodes contribute zero and paths cannot pass through the removed central node.",
  inputs: inputFields,
  outputs: [
    {
      id: "nodeLocalEfficiencies",
      label: "Node local efficiencies",
      kind: "numberList",
    },
    {
      id: "meanLocalEfficiency",
      label: "Mean local efficiency",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      adjacency: value.adjacency as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
