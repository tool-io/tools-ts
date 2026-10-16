import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ recordsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "recordsJson", label: "recordsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.iniRecords(i.recordsJson);
  return H.finish({
    records: H.groups(r, (v) => JSON.stringify([v.section, v.name])).map(
      (g) => {
        const index = g.indexes.at(-1)!;
        return { ...r[index], index };
      },
    ),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"section":"a","name":"x","value":"1"},{"section":"a","name":"x","value":"2"},{"section":"b","name":"x","value":"3"}]',
  },
  output: {
    result: {
      records: [
        { section: "a", name: "x", value: "2", index: 1 },
        { section: "b", name: "x", value: "3", index: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "INI Section Key Last Wins",
      "INI configuration",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["ini", "INI configuration", "software development"],
    keywords: ["INI configuration", "software development"],
  },
  id: "ini/section-key-last-wins",
  title: "INI Section Key Last Wins",
  description:
    "Resolve explicit INI section/key observations under case-sensitive last-wins policy, preserving winner indexes and separate section identity.",
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
          records: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                section: { type: "string" },
                name: { type: "string" },
                value: { type: "string" },
                index: { type: "number" },
              },
              required: ["section", "name", "value", "index"],
            },
          },
        },
        required: ["records"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
