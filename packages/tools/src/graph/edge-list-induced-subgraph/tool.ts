import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  edgesJson: string;
  vertices: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
  { id: "vertices", kind: "stringList", label: "vertices" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  H.check(H.unique(i.vertices).length === i.vertices.length);
  return H.finish({
    edges: e.filter(
      (v) => i.vertices.includes(v.source) && i.vertices.includes(v.target),
    ),
    vertices: [...i.vertices],
  });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
    vertices: ["u"],
  },
  output: {
    result: {
      edges: [{ id: "c", source: "u", target: "u", weight: 1 }],
      vertices: ["u"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/edge-list-induced-subgraph",
  title: "Edge List Induced Subgraph Selector",
  description:
    "Select the vertex-induced edge observations for an explicit vertex set, preserving isolated declared vertices and occurrence identities.",
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
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                id: { type: "string" },
                source: { type: "string" },
                target: { type: "string" },
                weight: { type: "number" },
              },
              required: ["id", "source", "target", "weight"],
            },
          },
          vertices: { type: "array", items: { type: "string" } },
        },
        required: ["edges", "vertices"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
