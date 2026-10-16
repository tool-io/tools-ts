import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ recordsJson: string; requiredJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "recordsJson", label: "recordsJson", kind: "string" },
  { id: "requiredJson", label: "requiredJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.iniRecords(i.recordsJson);
  const q = H.records(i.requiredJson).map((v) => ({
    section: H.str(v.section),
    name: H.str(v.name),
  }));
  return H.finish({
    missing: q.filter(
      (v) => !r.some((x) => x.section === v.section && x.name === v.name),
    ),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"section":"a","name":"x","value":"1"},{"section":"a","name":"x","value":"2"},{"section":"b","name":"x","value":"3"}]',
    requiredJson: '[{"section":"a","name":"z"}]',
  },
  output: { result: { missing: [{ section: "a", name: "z" }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "INI Required Key Coverage",
      "INI configuration",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["ini", "INI configuration", "software development"],
    keywords: ["INI configuration", "software development"],
  },
  id: "ini/section-required-key-coverage",
  title: "INI Required Key Coverage",
  description:
    "Audit exact section-scoped required INI keys against supplied observations, distinguishing an empty value from a missing key; no required-key registry.",
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
          missing: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                section: { type: "string" },
                name: { type: "string" },
              },
              required: ["section", "name"],
            },
          },
        },
        required: ["missing"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
