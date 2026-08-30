import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, mean, graph } from "../shared.js";
export type Input = Readonly<{
  readonly adjacency: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly localCoefficients: readonly number[];
  readonly meanLocalCoefficient: number;
  readonly transitivity: number;
}>;
const inputFields = [
  { id: "adjacency", label: "Adjacency", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = graph(input.adjacency),
    localCoefficients: number[] = [];
  let trianglesAtNodes = 0,
    triples = 0;
  for (let i = 0; i < n; i++) {
    const neighbors = input.adjacency[i].flatMap((v, j) => (v ? [j] : [])),
      pairs = (neighbors.length * (neighbors.length - 1)) / 2;
    let linked = 0;
    for (let a = 0; a < neighbors.length; a++)
      for (let b = a + 1; b < neighbors.length; b++)
        linked += input.adjacency[neighbors[a]][neighbors[b]];
    localCoefficients.push(pairs === 0 ? 0 : linked / pairs);
    trianglesAtNodes += linked;
    triples += pairs;
  }
  return {
    localCoefficients,
    meanLocalCoefficient: mean(localCoefficients),
    transitivity: triples === 0 ? 0 : trianglesAtNodes / triples,
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
  localCoefficients: [1, 1, 1],
  meanLocalCoefficient: 1,
  transitivity: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/binary-network-clustering",
  title: "Network Clustering Coefficient",
  description:
    "Compute local clustering, mean including degree<2 zero coefficients, and global transitivity for a binary undirected simple graph.",
  inputs: inputFields,
  outputs: [
    {
      id: "localCoefficients",
      label: "Local coefficients",
      kind: "numberList",
    },
    {
      id: "meanLocalCoefficient",
      label: "Mean local coefficient",
      kind: "number",
    },
    { id: "transitivity", label: "Transitivity", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      adjacency: value.adjacency as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
