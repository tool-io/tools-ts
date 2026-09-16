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
  const loops = e.flatMap((v, j) => (v.source === v.target ? [j] : [])),
    parallel = H.duplicates(e, (v) =>
      JSON.stringify(
        i.directed ? [v.source, v.target] : [v.source, v.target].sort(),
      ),
    );
  return H.finish({
    simple: !loops.length && !parallel.length,
    loops,
    parallel,
  });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
    directed: false,
  },
  output: {
    result: {
      simple: false,
      loops: [2],
      parallel: [{ key: '["u","v"]', indexes: [0, 1] }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/graph-loop-parallel-simplicity",
  title: "Graph Loop Parallel Simplicity Check",
  description:
    "Audit explicit edge occurrences for self-loops and parallel endpoint pairs under directed or undirected graph simplicity.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
