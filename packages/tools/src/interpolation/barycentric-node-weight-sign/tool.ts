import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ nodes: readonly number[]; nodeIndex: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "nodes", label: "Nodes", kind: "numberList" },
  { id: "nodeIndex", label: "Node index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.nodes.length > 0 &&
      i.nodes.every((x, j) => j === 0 || x > i.nodes[j - 1]),
  );
  H.int(i.nodeIndex, 0, i.nodes.length - 1);
  return H.finish({
    weightSign: (i.nodes.length - 1 - i.nodeIndex) % 2 === 0 ? 1 : -1,
  });
};
export const example = {
  input: { nodes: [1, 2, 4], nodeIndex: 1 },
  output: { result: { weightSign: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interpolation/barycentric-node-weight-sign",
  title: "Interpolation: Barycentric Node Weight Sign Tool",
  description:
    "Determine the barycentric interpolation weight sign for one index in explicitly increasing distinct real nodes, without forming unstable products.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { weightSign: { type: "number" } },
        required: ["weightSign"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
