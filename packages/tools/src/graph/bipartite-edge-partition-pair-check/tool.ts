import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  leftPartition: readonly string[];
  rightPartition: readonly string[];
  from: string;
  to: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftPartition", label: "Left partition", kind: "stringList" },
  { id: "rightPartition", label: "Right partition", kind: "stringList" },
  { id: "from", label: "From", kind: "string" },
  { id: "to", label: "To", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const all = [...i.leftPartition, ...i.rightPartition];
  H.check(new Set(all).size === all.length);
  return H.finish({
    crossesPartitions:
      (i.leftPartition.includes(i.from) && i.rightPartition.includes(i.to)) ||
      (i.rightPartition.includes(i.from) && i.leftPartition.includes(i.to)),
    endpointsKnown: all.includes(i.from) && all.includes(i.to),
  });
};
export const example = {
  input: {
    leftPartition: ["a", "b"],
    rightPartition: ["c"],
    from: "a",
    to: "c",
  },
  output: { result: { crossesPartitions: true, endpointsKnown: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/bipartite-edge-partition-pair-check",
  title: "Graph: Bipartite Edge Partition Pair Check Tool",
  description:
    "Check one undirected edge against explicit disjoint bipartition vertex labels, retaining unknown endpoints without claiming the whole graph is bipartite.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          crossesPartitions: { type: "boolean" },
          endpointsKnown: { type: "boolean" },
        },
        required: ["crossesPartitions", "endpointsKnown"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
