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
  const d = graphDistances(input.actualUnweightedUndirectedAdjacency);
  if (d.length < 2) simpleError("nodes", "N≥2.");
  return {
    observedHarmonicCloseness: d.map(
      (r) => sum(r.map((v) => (v > 0 ? 1 / v : 0))) / (d.length - 1),
    ),
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
  output: { result: { observedHarmonicCloseness: [0.75, 1, 0.75] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/network-closeness-sociology",
  title: "Closeness Sociology Calculator",
  description:
    "Explicit normalized HARMONIC closeness\u03a31/d/(N\u22121), unreachable vertices zero not artificial finite path. Actual binary undirected simple graph, not conventional closeness with implicit connectedness.",
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
