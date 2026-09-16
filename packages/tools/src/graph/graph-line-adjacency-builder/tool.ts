import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ edgesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  const pairs: string[][] = [];
  for (let j = 0; j < e.length; j++)
    for (let k = j + 1; k < e.length; k++)
      if (
        [e[j].source, e[j].target].some(
          (v) => v === e[k].source || v === e[k].target,
        )
      )
        pairs.push([e[j].id, e[k].id]);
  return H.finish({ vertices: e.map((v) => v.id), edges: pairs });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
  },
  output: {
    result: {
      vertices: ["a", "b", "c"],
      edges: [
        ["a", "b"],
        ["a", "c"],
        ["b", "c"],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/graph-line-adjacency-builder",
  title: "Graph Line Adjacency Builder",
  description:
    "Build undirected line-graph adjacency between distinct edge occurrences sharing endpoints; original edge IDs become vertices and loops do not create line self-loops.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
