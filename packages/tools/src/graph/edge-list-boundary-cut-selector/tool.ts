import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  edgesJson: string;
  vertices: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
  { id: "vertices", kind: "stringList", label: "vertices" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  H.check(H.unique(i.vertices).length === i.vertices.length);
  return H.finish({
    edges: e.filter(
      (v) => i.vertices.includes(v.source) !== i.vertices.includes(v.target),
    ),
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
      edges: [
        { id: "a", source: "u", target: "v", weight: 2 },
        { id: "b", source: "v", target: "u", weight: 4 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/edge-list-boundary-cut-selector",
  title: "Edge List Boundary Cut Selector",
  description:
    "Select edges crossing an explicit vertex-set boundary using endpoint exclusive membership; direction and occurrence IDs remain intact.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
