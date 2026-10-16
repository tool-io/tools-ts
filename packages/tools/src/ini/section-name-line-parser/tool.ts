import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ line: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "line", label: "line", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(!/[\r\n\u0000]/.test(i.line));
  const m = /^\s*\[([^\[\]]+)\]\s*(?![\s\S])/.exec(i.line);
  H.check(m);
  H.iniName(m![1].trim());
  return H.finish({ section: m![1].trim() });
};
export const example = {
  input: { line: " [ main ] " },
  output: { result: { section: "main" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "INI Section Name Line Parser",
      "INI configuration",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["ini", "INI configuration", "software development"],
    keywords: ["INI configuration", "software development"],
  },
  id: "ini/section-name-line-parser",
  title: "INI Section Name Line Parser",
  description:
    "Parse one restricted INI [section] line with outer whitespace only; inline comments, empty names and embedded brackets are rejected.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { section: { type: "string" } },
        required: ["section"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
