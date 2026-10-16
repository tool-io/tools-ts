import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ leftJson: string; rightJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "leftJson", label: "leftJson", kind: "string" },
  { id: "rightJson", label: "rightJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const a = H.headerPairs(i.leftJson),
    b = H.headerPairs(i.rightJson);
  return H.finish({
    headers: [...a, ...b],
    sources: [
      ...a.map((_, index) => ({ side: "left", index })),
      ...b.map((_, index) => ({ side: "right", index })),
    ],
  });
};
export const example = {
  input: {
    leftJson:
      '[{"name":"X-A","value":"one"},{"name":"x-a","value":"two"},{"name":"Set-Cookie","value":"a=1"}]',
    rightJson: "[]",
  },
  output: {
    result: {
      headers: [
        { name: "X-A", value: "one" },
        { name: "x-a", value: "two" },
        { name: "Set-Cookie", value: "a=1" },
      ],
      sources: [
        { side: "left", index: 0 },
        { side: "left", index: 1 },
        { side: "left", index: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["HTTP Header Occurrence Stable Merge", "HTTP", "web development"],
    collections: ["encode-decode"],
    fields: ["HTTP", "web development"],
    keywords: ["HTTP", "web development"],
  },
  id: "http/header-occurrence-stable-merge",
  title: "HTTP Header Occurrence Stable Merge",
  description:
    "Append two explicit ordered HTTP field occurrence lists with source-side/index provenance, preserving Set-Cookie and all repeated values rather than comma combining.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          headers: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                value: { type: "string" },
              },
              required: ["name", "value"],
            },
          },
          sources: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                side: { type: "string" },
                index: { type: "number" },
              },
              required: ["side", "index"],
            },
          },
        },
        required: ["headers", "sources"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
