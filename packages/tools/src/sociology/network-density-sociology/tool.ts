import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  sum,
  graphDistances,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualUnweightedUndirectedAdjacency: readonly (readonly number[])[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualUnweightedUndirectedAdjacency",
    label: "Actual unweighted undirected adjacency",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  graphDistances(input.actualUnweightedUndirectedAdjacency);
  if (input.actualUnweightedUndirectedAdjacency.length < 2)
    simpleError("nodes", "At least two nodes.");
  return {
    value:
      sum(input.actualUnweightedUndirectedAdjacency.flat()) /
      (input.actualUnweightedUndirectedAdjacency.length *
        (input.actualUnweightedUndirectedAdjacency.length - 1)),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualUnweightedUndirectedAdjacency: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
  },
  output: { result: { value: 0.6666666666666666 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/network-density-sociology",
  title: "Network Density Sociology Calculator",
  description:
    "Undirected binary simple graph tie density2E/[N(N\u22121)], actual observed network, no inferred political/social ties.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
