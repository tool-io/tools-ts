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
  return H.finish({
    edges: e.map((v) => ({ ...v, source: v.target, target: v.source })),
  });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
  },
  output: {
    result: {
      edges: [
        { id: "a", source: "v", target: "u", weight: 2 },
        { id: "b", source: "u", target: "v", weight: 4 },
        { id: "c", source: "u", target: "u", weight: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/edge-list-direction-reverser",
  title: "Edge List Direction Reverser",
  description:
    "Reverse every directed edge observation without normalization, retaining edge IDs, weights and parallel edges.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
