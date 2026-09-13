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
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualUnweightedUndirectedAdjacency",
    label: "Actual unweighted undirected adjacency",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  graphDistances(input.actualUnweightedUndirectedAdjacency);
  if (input.actualUnweightedUndirectedAdjacency.length < 3)
    simpleError("nodes", "N≥3.");
  return {
    value:
      sum(
        input.actualUnweightedUndirectedAdjacency.map(
          (r) =>
            Math.max(
              ...input.actualUnweightedUndirectedAdjacency.map((s) => sum(s)),
            ) - sum(r),
        ),
      ) /
      ((input.actualUnweightedUndirectedAdjacency.length - 1) *
        (input.actualUnweightedUndirectedAdjacency.length - 2)),
  };
};
export const calculate = (input: Input): Output => {
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
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/network-centralization-degree",
  title: "Degree Centralization Calculator",
  description:
    "Freeman undirected degree centralization\u03a3(max degree\u2212degree)/[(N\u22121)(N\u22122)], N\u22653, actual simple binary graph; not normalized individual degree only.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
