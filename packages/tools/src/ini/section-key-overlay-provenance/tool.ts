import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ baseJson: string; overlayJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "baseJson", label: "baseJson", kind: "string" },
  { id: "overlayJson", label: "overlayJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const a = H.iniRecords(i.baseJson),
    r = [...a, ...H.iniRecords(i.overlayJson)];
  return H.finish({
    records: H.groups(r, (v) => JSON.stringify([v.section, v.name])).map(
      (g) => {
        const index = g.indexes.at(-1)!;
        return {
          ...r[index],
          side: index < a.length ? "base" : "overlay",
          index: index < a.length ? index : index - a.length,
          shadowed: g.indexes.slice(0, -1),
        };
      },
    ),
  });
};
export const example = {
  input: {
    baseJson: '[{"section": "a", "name": "x", "value": "1"}]',
    overlayJson: '[{"section": "a", "name": "x", "value": "2"}]',
  },
  output: {
    result: {
      records: [
        {
          section: "a",
          name: "x",
          value: "2",
          side: "overlay",
          index: 0,
          shadowed: [0],
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "INI Section Key Overlay Provenance",
      "INI configuration",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["ini", "INI configuration", "software development"],
    keywords: ["INI configuration", "software development"],
  },
  id: "ini/section-key-overlay-provenance",
  title: "INI Section Key Overlay Provenance",
  description:
    "Overlay explicit INI section/key records with last-wins origin and shadow-index provenance; no file access, include directives or process configuration mutation.",
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
                side: { type: "string" },
                index: { type: "number" },
                shadowed: { type: "array", items: { type: "number" } },
              },
              required: [
                "section",
                "name",
                "value",
                "side",
                "index",
                "shadowed",
              ],
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
