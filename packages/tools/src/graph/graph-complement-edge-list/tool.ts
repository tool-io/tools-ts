import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  edgesJson: string;
  vertices: readonly string[];
  directed: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
  { id: "vertices", kind: "stringList", label: "vertices" },
  { id: "directed", kind: "boolean", label: "directed" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  H.check(
    H.unique(i.vertices).length === i.vertices.length &&
      e.every(
        (v) => i.vertices.includes(v.source) && i.vertices.includes(v.target),
      ),
  );
  const edges: string[][] = [];
  for (let j = 0; j < i.vertices.length; j++)
    for (let k = i.directed ? 0 : j + 1; k < i.vertices.length; k++)
      if (
        j !== k &&
        !e.some(
          (v) =>
            (v.source === i.vertices[j] && v.target === i.vertices[k]) ||
            (!i.directed &&
              v.target === i.vertices[j] &&
              v.source === i.vertices[k]),
        )
      )
        edges.push([i.vertices[j], i.vertices[k]]);
  return H.finish({ edges });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
    vertices: ["u", "v", "w"],
    directed: false,
  },
  output: {
    result: {
      edges: [
        ["u", "w"],
        ["v", "w"],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/graph-complement-edge-list",
  title: "Graph Complement Edge List",
  description:
    "Build the loop-free complement on an explicit bounded vertex set; parallel edges count as one adjacency and directed complements use ordered pairs.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          edges: {
            type: "array",
            items: { type: "array", items: { type: "string" } },
          },
        },
        required: ["edges"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
