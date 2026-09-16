import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ edgesJson: string; directed: boolean }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
  { id: "directed", kind: "boolean", label: "directed" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  return H.finish({
    buckets: H.duplicates(e, (v) =>
      JSON.stringify(
        i.directed ? [v.source, v.target] : [v.source, v.target].sort(),
      ),
    ),
  });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
    directed: false,
  },
  output: { result: { buckets: [{ key: '["u","v"]', indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/edge-list-parallel-edge-buckets",
  title: "Edge List Parallel Edge Buckets",
  description:
    "Inventory parallel edge occurrences with exact directed or undirected endpoint equivalence; retain multiplicities rather than normalize away duplicates.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
