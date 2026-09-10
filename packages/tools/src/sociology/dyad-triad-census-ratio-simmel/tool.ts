import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sum, graph } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedAdjacency: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedAdjacency", label: "Observed adjacency", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const n = graph(input.observedAdjacency),
    a = input.observedAdjacency;
  let complete = 0,
    incomplete = 0;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      for (let k = j + 1; k < n; k++) {
        const edges = a[i][j] + a[i][k] + a[j][k];
        if (edges === 3) complete++;
        if (edges === 2) incomplete++;
      }
  return {
    completeTriadCount: complete,
    incompleteConnectedTriadCount: incomplete,
    observedDyadEdgeCount: sum(a.map((r) => sum(r))) / 2,
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
      completeTriadCount: 0,
      incompleteConnectedTriadCount: 1,
      observedDyadEdgeCount: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/dyad-triad-census-ratio-simmel",
  title: "Simmel Dyad-Triad Census Ratio Calculator",
  description:
    "Actual undirected dyad/connected-triad census, distinguishing complete and open triads; not directed16-class census or proof of Simmel social dynamics. Unconnected triple sets excluded.",
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
