import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ edgesJson: string; vertex: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
  { id: "vertex", kind: "string", label: "vertex" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  return H.finish({
    edges: e.filter((v) => v.source === i.vertex || v.target === i.vertex),
  });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
    vertex: "v",
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
  id: "graph/edge-list-incident-selector",
  title: "Edge List Incident Selector",
  description:
    "Select edge observations incident to an explicit vertex in either endpoint without discarding IDs, multiplicity or weights.",
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
        },
        required: ["edges"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
