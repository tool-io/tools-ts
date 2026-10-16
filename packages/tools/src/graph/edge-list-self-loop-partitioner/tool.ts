import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ edgesJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  return H.finish({
    loops: e.filter((v) => v.source === v.target),
    nonloops: e.filter((v) => v.source !== v.target),
  });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
  },
  output: {
    result: {
      loops: [{ id: "c", source: "u", target: "u", weight: 1 }],
      nonloops: [
        { id: "a", source: "u", target: "v", weight: 2 },
        { id: "b", source: "v", target: "u", weight: 4 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/edge-list-self-loop-partitioner",
  title: "Edge List Self Loop Partitioner",
  description:
    "Partition edge observations into self-loops and nonloops while preserving edge IDs, weights and caller order.",
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
          loops: {
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
          nonloops: {
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
        required: ["loops", "nonloops"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
