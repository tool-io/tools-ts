import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  sum,
  graph,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedAdjacency: readonly (readonly number[])[];
  readonly egoNodeIndex: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedAdjacency", label: "Observed adjacency", kind: "matrix" },
  { id: "egoNodeIndex", label: "Ego node index", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const n = graph(input.observedAdjacency);
  bounded(input.egoNodeIndex, "ego", 0, n - 1);
  const i = input.egoNodeIndex,
    neighbors = input.observedAdjacency[i].flatMap((v, j) => (v ? [j] : [])),
    k = positive(neighbors.length, "degree"),
    p = input.observedAdjacency.map((r) => {
      const d = sum(r);
      return r.map((v) => (d ? v / d : 0));
    });
  const c = sum(
    neighbors.map(
      (j) =>
        (p[i][j] +
          sum(p[i].map((v, q) => (q === i || q === j ? 0 : v * p[q][j])))) **
        2,
    ),
  );
  let ties = 0;
  neighbors.forEach((a, x) =>
    neighbors.slice(x + 1).forEach((b) => {
      ties += input.observedAdjacency[a][b];
    }),
  );
  return {
    observedEgoConstraint: c,
    observedEgoEfficiency: 1 - (2 * ties) / (k * k),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedAdjacency: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
    egoNodeIndex: 1,
  },
  output: { result: { observedEgoConstraint: 0.5, observedEgoEfficiency: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/burt-network-constraint-efficiency",
  title: "Burt Network Constraint Efficiency Calculator",
  description:
    "Actual binary undirected ego network Burt-style constraint summed over direct alters and effective-size efficiency1\u22122t/k\u00b2. Explicit equal tie weights; not weighted-network convention, causal brokerage or universal social-capital ranking.",
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
