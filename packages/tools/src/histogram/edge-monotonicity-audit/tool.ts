import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ edges: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "edges", label: "edges", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const violations = i.edges
    .slice(1)
    .flatMap((x, j) =>
      x <= i.edges[j]
        ? [{ left: j, right: j + 1, difference: x - i.edges[j] }]
        : [],
    );
  return H.finish({
    valid: i.edges.length >= 2 && violations.length === 0,
    violations,
  });
};
export const example = {
  input: { edges: [0, 1, 1, 0] },
  output: {
    result: {
      valid: false,
      violations: [
        { left: 1, right: 2, difference: 0 },
        { left: 2, right: 3, difference: -1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "histogram/edge-monotonicity-audit",
  title: "Histogram Edge Monotonicity Audit",
  description:
    "Audit strict histogram edge monotonicity and minimum arity without silently sorting or removing equal/backwards edges; preserve signed adjacent differences.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
