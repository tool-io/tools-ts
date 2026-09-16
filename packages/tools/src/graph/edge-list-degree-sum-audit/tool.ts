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
  const vertices = H.unique(e.flatMap((v) => [v.source, v.target]));
  const degrees = vertices.map((vertex) => ({
    vertex,
    incoming: e.filter((v) => v.target === vertex).length,
    outgoing: e.filter((v) => v.source === vertex).length,
    undirected: e.reduce(
      (s, v) => s + Number(v.source === vertex) + Number(v.target === vertex),
      0,
    ),
  }));
  return H.finish({
    degrees,
    inSum: degrees.reduce((s, v) => s + v.incoming, 0),
    outSum: degrees.reduce((s, v) => s + v.outgoing, 0),
    undirectedSum: degrees.reduce((s, v) => s + v.undirected, 0),
    edgeCount: e.length,
  });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
  },
  output: {
    result: {
      degrees: [
        { vertex: "u", incoming: 2, outgoing: 2, undirected: 4 },
        { vertex: "v", incoming: 1, outgoing: 1, undirected: 2 },
      ],
      inSum: 3,
      outSum: 3,
      undirectedSum: 6,
      edgeCount: 3,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/edge-list-degree-sum-audit",
  title: "Edge List Degree Sum Audit",
  description:
    "Audit degree-sum identities on occurrence-preserving directed edges; loops contribute twice to undirected degree and parallel occurrences count.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
