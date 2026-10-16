import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ edgesJson: string; order: readonly string[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
  { id: "order", kind: "stringList", label: "order" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  H.check(H.unique(i.order).length === i.order.length);
  const violations = e.flatMap((v, j) =>
    i.order.indexOf(v.source) < 0 ||
    i.order.indexOf(v.target) < 0 ||
    i.order.indexOf(v.source) >= i.order.indexOf(v.target)
      ? [j]
      : [],
  );
  return H.finish({ valid: violations.length === 0, violations });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
    order: ["u", "v"],
  },
  output: { result: { valid: false, violations: [1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/graph-topological-order-verifier",
  title: "Graph Topological Order Verifier",
  description:
    "Verify an explicit proposed topological order against every directed edge occurrence; unlike topological sorting it does not produce a replacement order.",
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
          valid: { type: "boolean" },
          violations: { type: "array", items: { type: "number" } },
        },
        required: ["valid", "violations"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
