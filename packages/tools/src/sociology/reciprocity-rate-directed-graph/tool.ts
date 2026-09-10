import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  sum,
  graph,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedDirectedAdjacency: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedDirectedAdjacency",
    label: "Observed directed adjacency",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const n = graph(input.observedDirectedAdjacency, true),
    a = input.observedDirectedAdjacency,
    t = positive(sum(a.map((r) => sum(r))), "arcs"),
    r = sum(a.map((row, i) => sum(row.map((v, j) => v * a[j][i]))));
  return {
    observedDirectedArcReciprocity: r / t,
    reciprocatedArcCount: r,
    totalObservedArcCount: t,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedDirectedAdjacency: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 0, 0],
    ],
  },
  output: {
    result: {
      observedDirectedArcReciprocity: 0.6666666666666666,
      reciprocatedArcCount: 2,
      totalObservedArcCount: 3,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/reciprocity-rate-directed-graph",
  title: "Directed Graph Reciprocity Rate Calculator",
  description:
    "Directed arc reciprocity:reciprocated directed arcs divided by all observed directed arcs, not reciprocal dyads/all dyads. No self-loops or unobserved-contact inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
