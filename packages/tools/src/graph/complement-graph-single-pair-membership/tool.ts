import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  from: string;
  to: string;
  vertices: readonly string[];
  originalEdgePresent: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "from", label: "From", kind: "string" },
  { id: "to", label: "To", kind: "string" },
  { id: "vertices", label: "Vertices", kind: "stringList" },
  {
    id: "originalEdgePresent",
    label: "Original edge present",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    new Set(i.vertices).size === i.vertices.length &&
      i.vertices.includes(i.from) &&
      i.vertices.includes(i.to) &&
      i.from !== i.to,
  );
  return H.finish({ complementEdge: !i.originalEdgePresent });
};
export const example = {
  input: {
    from: "a",
    to: "b",
    vertices: ["a", "b"],
    originalEdgePresent: false,
  },
  output: { result: { complementEdge: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/complement-graph-single-pair-membership",
  title: "Graph: Complement Graph Single Pair Membership Tool",
  description:
    "Evaluate complement membership of one nonloop pair in an explicit simple undirected vertex universe; original membership is caller established.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { complementEdge: { type: "boolean" } },
        required: ["complementEdge"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
