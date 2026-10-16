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
    global: r.filter((v) => v.section === ""),
    sectioned: r.filter((v) => v.section !== ""),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"section": "", "name": "x", "value": "1"}, {"section": "b", "name": "x", "value": "3"}]',
  },
  output: {
    result: {
      global: [{ section: "", name: "x", value: "1" }],
      sectioned: [{ section: "b", name: "x", value: "3" }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "INI Global Key Section Partition",
      "INI configuration",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["ini", "INI configuration", "software development"],
    keywords: ["INI configuration", "software development"],
  },
  id: "ini/global-key-section-partition",
  title: "INI Global Key Section Partition",
  description:
    "Partition explicit INI key observations between the unsectioned global namespace and named sections; preserves original records, duplicates and empty values.",
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
          global: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                section: { type: "string" },
                name: { type: "string" },
                value: { type: "string" },
              },
              required: ["section", "name", "value"],
            },
          },
          sectioned: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                section: { type: "string" },
                name: { type: "string" },
                value: { type: "string" },
              },
              required: ["section", "name", "value"],
            },
          },
        },
        required: ["global", "sectioned"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
