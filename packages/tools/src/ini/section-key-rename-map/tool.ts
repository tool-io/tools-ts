import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ recordsJson: string; mappingJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "recordsJson", label: "recordsJson", kind: "string" },
  { id: "mappingJson", label: "mappingJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.iniRecords(i.recordsJson);
  const m = H.records(i.mappingJson).map((v) => ({
    section: H.str(v.section),
    from: H.str(v.from),
    to: H.str(v.to),
  }));
  m.forEach((v) => {
    H.iniName(v.from);
    H.iniName(v.to);
  });
  H.check(
    H.unique(m.map((v) => JSON.stringify([v.section, v.from]))).length ===
      m.length,
  );
  const renamed = r.map((v) => ({
    ...v,
    name:
      m.find((x) => x.section === v.section && x.from === v.name)?.to ?? v.name,
  }));
  for (const g of H.groups(renamed, (v) => JSON.stringify([v.section, v.name])))
    H.check(
      H.unique(g.indexes.map((j) => JSON.stringify([r[j].section, r[j].name])))
        .length === 1,
    );
  return H.finish({ records: renamed });
};
export const example = {
  input: {
    recordsJson:
      '[{"section": "a", "name": "x", "value": "1"}, {"section": "b", "name": "x", "value": "3"}]',
    mappingJson: '[{"section":"a","from":"x","to":"y"}]',
  },
  output: {
    result: {
      records: [
        { section: "a", name: "y", value: "1" },
        { section: "b", name: "x", value: "3" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "INI Section Key Rename Map",
      "INI configuration",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["ini", "INI configuration", "software development"],
    keywords: ["INI configuration", "software development"],
  },
  id: "ini/section-key-rename-map",
  title: "INI Section Key Rename Map",
  description:
    "Rename INI keys with an explicit section-scoped map and reject introduced section/key collisions; unmapped observations are preserved, existing duplicates are retained only if not newly conflated.",
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
                value: { type: "string" },
                name: { type: "string" },
              },
              required: ["section", "value", "name"],
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
