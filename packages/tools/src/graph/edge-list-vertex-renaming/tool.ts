import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ edgesJson: string; mappingJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
  { id: "mappingJson", kind: "string", label: "mappingJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  const m = H.records(i.mappingJson).map(
    (r) => [H.str(r.from), H.str(r.to)] as const,
  );
  H.check(
    H.unique(m.map((v) => v[0])).length === m.length &&
      H.unique(m.map((v) => v[1])).length === m.length,
  );
  const names = H.unique(e.flatMap((v) => [v.source, v.target])),
    map = new Map(m);
  H.check(names.every((n) => map.has(n)));
  return H.finish({
    edges: e.map((v) => ({
      ...v,
      source: map.get(v.source)!,
      target: map.get(v.target)!,
    })),
  });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
    mappingJson: '[{"from":"u","to":"x"},{"from":"v","to":"y"}]',
  },
  output: {
    result: {
      edges: [
        { id: "a", source: "x", target: "y", weight: 2 },
        { id: "b", source: "y", target: "x", weight: 4 },
        { id: "c", source: "x", target: "x", weight: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/edge-list-vertex-renaming",
  title: "Edge List Vertex Renaming Tool",
  description:
    "Rename all observed edge endpoints with an explicit injective complete mapping; no vertex merging or inferred aliases.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
