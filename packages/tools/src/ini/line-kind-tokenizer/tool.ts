import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "text", label: "text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({
    lines: i.text.split(/\r\n|\n/).map((line, index) => {
      const s = line.trim();
      if (s === "") return { index, kind: "blank" as const };
      if (s.startsWith(";") || s.startsWith("#"))
        return { index, kind: "comment" as const };
      if (s.startsWith("[")) {
        H.check(s.endsWith("]"));
        const section = s.slice(1, -1).trim();
        H.iniName(section);
        return { index, kind: "section" as const, section };
      }
      return { index, kind: "assignment" as const, ...H.iniAssignment(line) };
    }),
  });
};
export const example = {
  input: { text: "[a]\nx=1\n#c" },
  output: {
    result: {
      lines: [
        { index: 0, kind: "section", section: "a" },
        { index: 1, kind: "assignment", name: "x", value: "1" },
        { index: 2, kind: "comment" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "INI Line Kind Tokenizer",
      "INI configuration",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["ini", "INI configuration", "software development"],
    keywords: ["INI configuration", "software development"],
  },
  id: "ini/line-kind-tokenizer",
  title: "INI Line Kind Tokenizer",
  description:
    "Tokenize restricted INI physical lines into blank/comment/section/trimmed equals assignments; no multiline, escaping, interpolation, inline comments or inheritance.",
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
          lines: {
            type: "array",
            items: {
              anyOf: [
                {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    index: { type: "integer", minimum: 0 },
                    kind: { type: "string", enum: ["blank", "comment"] },
                  },
                  required: ["index", "kind"],
                },
                {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    index: { type: "integer", minimum: 0 },
                    kind: { type: "string", const: "section" },
                    section: { type: "string" },
                  },
                  required: ["index", "kind", "section"],
                },
                {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    index: { type: "integer", minimum: 0 },
                    kind: { type: "string", const: "assignment" },
                    name: { type: "string" },
                    value: { type: "string" },
                  },
                  required: ["index", "kind", "name", "value"],
                },
              ],
            },
          },
        },
        required: ["lines"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
