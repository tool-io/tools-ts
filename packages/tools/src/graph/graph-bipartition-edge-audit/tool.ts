import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  edgesJson: string;
  left: readonly string[];
  right: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
  { id: "left", kind: "stringList", label: "left" },
  { id: "right", kind: "stringList", label: "right" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  H.check(
    H.unique(i.left).length === i.left.length &&
      H.unique(i.right).length === i.right.length &&
      i.left.every((x) => !i.right.includes(x)),
  );
  const violations = e.flatMap((v, j) =>
    (i.left.includes(v.source) && i.right.includes(v.target)) ||
    (i.right.includes(v.source) && i.left.includes(v.target))
      ? []
      : [j],
  );
  return H.finish({ valid: violations.length === 0, violations });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
    left: ["u"],
    right: ["v"],
  },
  output: { result: { valid: false, violations: [2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/graph-bipartition-edge-audit",
  title: "Graph Declared Bipartition Edge Audit",
  description:
    "Verify a supplied disjoint bipartition against each edge occurrence, reporting unknown endpoints and within-side edges rather than finding a new coloring.",
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
