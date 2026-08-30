import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, paths } from "../shared.js";
export type Input = Readonly<{
  readonly adjacency: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly meanConnectedPathLength: number;
  readonly connectedPairCount: number;
  readonly disconnectedPairCount: number;
  readonly allPairsConnected: boolean;
}>;
const inputFields = [
  { id: "adjacency", label: "Adjacency", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const d = paths(input.adjacency);
  let sum = 0,
    connectedPairCount = 0,
    disconnectedPairCount = 0;
  for (let i = 0; i < d.length; i++)
    for (let j = i + 1; j < d.length; j++)
      if (Number.isFinite(d[i][j])) {
        sum += d[i][j];
        connectedPairCount++;
      } else disconnectedPairCount++;
  return {
    meanConnectedPathLength: connectedPairCount ? sum / connectedPairCount : 0,
    connectedPairCount,
    disconnectedPairCount,
    allPairsConnected: disconnectedPairCount === 0,
  };
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
  meanConnectedPathLength: 1.3333333333333333,
  connectedPairCount: 3,
  disconnectedPairCount: 0,
  allPairsConnected: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/network-connected-pair-path-length",
  title: "Network Path Length",
  description:
    "Calculate mean shortest path over connected unordered pairs and report excluded disconnected pairs; zero mean with zero connected pairs is an explicit empty-pair result.",
  inputs: inputFields,
  outputs: [
    {
      id: "meanConnectedPathLength",
      label: "Mean connected path length",
      kind: "number",
    },
    { id: "connectedPairCount", label: "Connected pair count", kind: "number" },
    {
      id: "disconnectedPairCount",
      label: "Disconnected pair count",
      kind: "number",
    },
    { id: "allPairsConnected", label: "All pairs connected", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      adjacency: value.adjacency as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
