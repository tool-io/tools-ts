import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  edges: readonly number[];
  minimum: number;
  maximum: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "edges", label: "edges", kind: "numberList" },
  { id: "minimum", label: "minimum", kind: "number" },
  { id: "maximum", label: "maximum", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.histogramEdges(i.edges);
  H.check(i.maximum >= i.minimum);
  return H.finish({
    covered: Math.max(
      0,
      Math.min(i.maximum, i.edges.at(-1)!) - Math.max(i.minimum, i.edges[0]),
    ),
    below: Math.max(0, Math.min(i.maximum, i.edges[0]) - i.minimum),
    above: Math.max(0, i.maximum - Math.max(i.minimum, i.edges.at(-1)!)),
  });
};
export const example = {
  input: { edges: [0, 1, 2], minimum: -1, maximum: 4 },
  output: { result: { covered: 2, below: 1, above: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "histogram/bin-domain-coverage-budget",
  title: "Histogram Domain Coverage Budget",
  description:
    "Budget lengths of a supplied finite numeric domain covered by a contiguous histogram domain versus below/above portions; not sample count or probability coverage.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
