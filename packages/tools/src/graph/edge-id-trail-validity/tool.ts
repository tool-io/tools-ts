import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  edgesJson: string;
  edgeIds: readonly string[];
  start: string;
  directed: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
  { id: "edgeIds", kind: "stringList", label: "edgeIds" },
  { id: "start", kind: "string", label: "start" },
  { id: "directed", kind: "boolean", label: "directed" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  const map = new Map(e.map((v) => [v.id, v])),
    vertices = [i.start],
    violations: number[] = [];
  i.edgeIds.forEach((id, j) => {
    const v = map.get(id),
      p = vertices.at(-1)!;
    if (
      !v ||
      i.edgeIds.indexOf(id) !== j ||
      !(v.source === p || (!i.directed && v.target === p))
    ) {
      violations.push(j);
      vertices.push(p);
    } else vertices.push(v.source === p ? v.target : v.source);
  });
  return H.finish({ valid: violations.length === 0, violations, vertices });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
    edgeIds: ["a", "b"],
    start: "u",
    directed: true,
  },
  output: {
    result: { valid: true, violations: [], vertices: ["u", "v", "u"] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/edge-id-trail-validity",
  title: "Edge ID Trail Validity Check",
  description:
    "Verify an edge-ID trail with no repeated edge occurrences from an explicit start; directed or undirected traversal, with failure indexes retained.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
