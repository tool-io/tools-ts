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
  r.forEach((v) =>
    H.check(
      v.value === v.value.trim() &&
        !/^[;#]/.test(v.name) &&
        !v.name.includes("="),
    ),
  );
  let section = "";
  return H.finish({
    text: r
      .map((v) => {
        let out = "";
        if (v.section !== section) {
          section = v.section;
          H.check(
            section !== "",
            "Cannot return to global namespace after a section",
          );
          out = "[" + section + "]\n";
        }
        return out + v.name + "=" + v.value;
      })
      .join("\n"),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"section": "a", "name": "x", "value": "1"}, {"section": "b", "name": "x", "value": "3"}]',
  },
  output: { result: { text: "[a]\nx=1\n[b]\nx=3" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Restricted INI Record Document Formatter",
      "INI configuration",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["ini", "INI configuration", "software development"],
    keywords: ["INI configuration", "software development"],
  },
  id: "ini/normalized-document-formatter",
  title: "Restricted INI Record Document Formatter",
  description:
    "Format normalized explicit INI records preserving occurrence order, re-emitting section headings on changes; values must be single-line trimmed literals, no quoting or interpolation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string" } },
        required: ["text"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
