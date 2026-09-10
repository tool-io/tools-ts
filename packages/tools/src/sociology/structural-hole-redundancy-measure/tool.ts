import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sum, graph } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedAlterAdjacency: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedAlterAdjacency",
    label: "Observed alter adjacency",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const n = graph(input.observedAlterAdjacency),
    ties = sum(input.observedAlterAdjacency.map((r) => sum(r))) / 2;
  return {
    observedAlterCount: n,
    observedAlterTieCount: ties,
    conditionalRedundancy: (2 * ties) / n,
    conditionalEffectiveSize: n - (2 * ties) / n,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedAlterAdjacency: [
      [0, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ],
  },
  output: {
    result: {
      observedAlterCount: 3,
      observedAlterTieCount: 1,
      conditionalRedundancy: 0.6666666666666666,
      conditionalEffectiveSize: 2.3333333333333335,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/structural-hole-redundancy-measure",
  title: "Structural Hole Redundancy Measure Calculator",
  description:
    "Actual observed ego-alter subgraph excludes ego itself; binary undirected effective-size n\u22122t/n and redundancy2t/n. Not Burtconstraint or a count of unobserved ties; complete observation assumption caller verified.",
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
