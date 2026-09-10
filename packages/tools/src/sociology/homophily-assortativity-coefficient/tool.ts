import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  aligned,
  sum,
  graph,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedDirectedAdjacency: readonly (readonly number[])[];
  readonly independentlyAssignedNodeClasses: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedDirectedAdjacency",
    label: "Observed directed adjacency",
    kind: "matrix",
  },
  {
    id: "independentlyAssignedNodeClasses",
    label: "Independently assigned node classes",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const n = graph(input.observedDirectedAdjacency, true);
  aligned(
    input.observedDirectedAdjacency,
    input.independentlyAssignedNodeClasses,
    "classes",
  );
  if (input.independentlyAssignedNodeClasses.some((v) => !v.trim()))
    simpleError(
      "classes",
      "Independently assigned nonempty categorical labels.",
    );
  const labels = [...new Set(input.independentlyAssignedNodeClasses)],
    m = positive(
      sum(input.observedDirectedAdjacency.map((r) => sum(r))),
      "arcs",
    ),
    e = labels.map((a) =>
      labels.map(
        (b) =>
          sum(
            input.observedDirectedAdjacency.map((r, i) =>
              sum(
                r.map((v, j) =>
                  input.independentlyAssignedNodeClasses[i] === a &&
                  input.independentlyAssignedNodeClasses[j] === b
                    ? v
                    : 0,
                ),
              ),
            ),
          ) / m,
      ),
    ),
    out = e.map((r) => sum(r)),
    incoming = labels.map((_, i) => sum(e.map((r) => r[i]))),
    expected = sum(out.map((v, i) => v * incoming[i]));
  positive(1 - expected, "assortativitydenominator");
  return {
    observedCategoricalAssortativity:
      (sum(e.map((r, i) => r[i])) - expected) / (1 - expected),
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
      [0, 0, 1],
      [1, 0, 0],
    ],
    independentlyAssignedNodeClasses: ["a", "a", "b"],
  },
  output: { result: { observedCategoricalAssortativity: -0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/homophily-assortativity-coefficient",
  title: "Homophily Assortativity Coefficient Calculator",
  description:
    "Actual directed categorical Newman assortativity with independently assigned classes, out/in marginals and unknown population context. No ethnicity/identity inference or causal homophily; single-class degeneracy rejected.",
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
