import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, betweenness } from "../batch49-shared.js";
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
  return {
    rawNodeBetweenness: betweenness(input.actualUnweightedUndirectedAdjacency),
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
  output: { result: { rawNodeBetweenness: [0, 1, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/network-betweenness-centrality",
  title: "Betweenness Centrality Calculator",
  description:
    "Brandesunweighted UNDIRECTED raw node betweenness, shortest path ties fractionally shared, end points excluded, unordered pairs, count not normalized. \u226464nodes, no weighted/directed inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawNodeBetweenness: { type: "array", items: { type: "number" } },
        },
        required: ["rawNodeBetweenness"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
