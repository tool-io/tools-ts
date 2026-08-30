import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, graph } from "../shared.js";
export type Input = Readonly<{
  readonly adjacency: readonly (readonly number[])[];
  readonly degreeThresholds: readonly number[];
}>;
export type Output = Readonly<{
  readonly eligibleNodeCounts: readonly number[];
  readonly richClubCoefficients: readonly number[];
  readonly coefficientDefinedFlags: readonly number[];
}>;
const inputFields = [
  { id: "adjacency", label: "Adjacency", kind: "matrix" },
  { id: "degreeThresholds", label: "Degree thresholds", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  graph(input.adjacency);
  if (!input.degreeThresholds.length || input.degreeThresholds.length > 128)
    simpleError(
      "degreeThresholds",
      "Between one and 128 degree thresholds required.",
    );
  input.degreeThresholds.forEach((v) => count(v, "degreeThresholds"));
  const degrees = input.adjacency.map((row) => row.reduce((a, b) => a + b, 0)),
    eligibleNodeCounts: number[] = [],
    richClubCoefficients: number[] = [],
    coefficientDefinedFlags: number[] = [];
  for (const k of input.degreeThresholds) {
    const nodes = degrees.flatMap((v, i) => (v > k ? [i] : []));
    let edges = 0;
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++)
        edges += input.adjacency[nodes[i]][nodes[j]];
    eligibleNodeCounts.push(nodes.length);
    richClubCoefficients.push(
      nodes.length < 2 ? 0 : (2 * edges) / (nodes.length * (nodes.length - 1)),
    );
    coefficientDefinedFlags.push(nodes.length >= 2 ? 1 : 0);
  }
  return { eligibleNodeCounts, richClubCoefficients, coefficientDefinedFlags };
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
  degreeThresholds: [1, 2],
} satisfies Input;
export const exampleOutput = {
  eligibleNodeCounts: [3, 0],
  richClubCoefficients: [1, 0],
  coefficientDefinedFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/degree-threshold-rich-club",
  title: "Rich Club Coefficient",
  description:
    "Compute unnormalized rich-club coefficients for nodes with degree strictly above each supplied threshold; fewer-than-two-node cases carry an explicit undefined flag.",
  inputs: inputFields,
  outputs: [
    {
      id: "eligibleNodeCounts",
      label: "Eligible node counts",
      kind: "numberList",
    },
    {
      id: "richClubCoefficients",
      label: "Rich club coefficients",
      kind: "numberList",
    },
    {
      id: "coefficientDefinedFlags",
      label: "Coefficient defined flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      adjacency: value.adjacency as readonly (readonly number[])[],
      degreeThresholds: value.degreeThresholds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
