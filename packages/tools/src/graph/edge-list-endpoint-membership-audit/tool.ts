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
    violations: e.flatMap((v, index) =>
      !i.vertices.includes(v.source) || !i.vertices.includes(v.target)
        ? [
            {
              index,
              missing: H.unique(
                [v.source, v.target].filter((x) => !i.vertices.includes(x)),
              ),
            },
          ]
        : [],
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
      violations: [
        { index: 0, missing: ["v"] },
        { index: 1, missing: ["v"] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/edge-list-endpoint-membership-audit",
  title: "Edge List Endpoint Membership Audit",
  description:
    "Audit edge endpoints against an explicit declared vertex set; missing vertices remain violations instead of being auto-added.",
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
          violations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                missing: { type: "array", items: { type: "string" } },
              },
              required: ["index", "missing"],
            },
          },
        },
        required: ["violations"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
