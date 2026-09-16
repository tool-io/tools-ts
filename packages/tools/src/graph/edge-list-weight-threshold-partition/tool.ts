import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ edgesJson: string; threshold: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
  { id: "threshold", kind: "number", label: "threshold" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  return H.finish({
    below: e.filter((v) => v.weight < i.threshold),
    atOrAbove: e.filter((v) => v.weight >= i.threshold),
  });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
    threshold: 2,
  },
  output: {
    result: {
      below: [{ id: "c", source: "u", target: "u", weight: 1 }],
      atOrAbove: [
        { id: "a", source: "u", target: "v", weight: 2 },
        { id: "b", source: "v", target: "u", weight: 4 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/edge-list-weight-threshold-partition",
  title: "Edge List Weight Threshold Partition",
  description:
    "Partition weighted edge observations at an explicit inclusive threshold, preserving signed weights and all occurrence identities.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
