import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
  graph,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedAdjacency: readonly (readonly number[])[];
  readonly callerAlpha: number;
  readonly callerBeta: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedAdjacency", label: "Observed adjacency", kind: "matrix" },
  { id: "callerAlpha", label: "Caller alpha", kind: "number" },
  { id: "callerBeta", label: "Caller beta", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const n = graph(input.observedAdjacency),
    d = input.observedAdjacency.map((r) => sum(r)),
    max = Math.max(...d);
  positive(input.callerAlpha, "alpha");
  if (Math.abs(input.callerBeta) * max >= 0.9)
    simpleError("beta", "Bounded contraction abs(beta)×maximumdegree<0.9.");
  let x = d.map((v) => input.callerAlpha * v);
  for (let k = 0; k < 1024; k++) {
    const next = x.map(
        (_, i) =>
          input.callerAlpha * d[i] +
          input.callerBeta *
            sum(input.observedAdjacency[i].map((v, j) => v * x[j])),
      ),
      error = Math.max(...next.map((v, i) => Math.abs(v - x[i])));
    x = next;
    if (error <= 1e-12 * Math.max(1, ...x.map(Math.abs))) break;
    if (k === 1023)
      simpleError("iteration", "Bounded fixed point must converge.");
  }
  return { conditionalBonacichPowerByNode: x };
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
    callerAlpha: 1,
    callerBeta: 0,
  },
  output: { result: { conditionalBonacichPowerByNode: [1, 2, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/eigenvector-centrality-bonacich-power",
  title: "Bonacich Eigenvector Power Centrality Calculator",
  description:
    "Bonacich resolvent power \u03b1(I\u2212\u03b2A)\u207b\u00b9A1over actual undirected binary network under caller contraction parameters. Not generic principal-eigenvector centrality or inferred influence; node order explicit and disconnected networks retained.",
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
