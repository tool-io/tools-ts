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
  readonly observedAdjacency: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedAdjacency", label: "Observed adjacency", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const n = graph(input.observedAdjacency),
    a = input.observedAdjacency,
    d = a.map((r) => sum(r)),
    triples = positive(
      sum(d.map((k) => (k * (k - 1)) / 2)),
      "connectedtriples",
    );
  let triangles = 0;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      for (let k = j + 1; k < n; k++) triangles += a[i][j] * a[j][k] * a[k][i];
  return {
    observedGlobalTransitivity: (3 * triangles) / triples,
    observedTriangleCount: triangles,
    connectedTripleCount: triples,
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
  },
  output: {
    result: {
      observedGlobalTransitivity: 0,
      observedTriangleCount: 0,
      connectedTripleCount: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/global-transitivity-clustering-ratio",
  title: "Global Transitivity Clustering Ratio Calculator",
  description:
    "Actual binary undirected global transitivity3triangles/connected triples; not mean local clustering and disconnected observed nodes retained. No triples leaves ratio undefined and is rejected.",
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
