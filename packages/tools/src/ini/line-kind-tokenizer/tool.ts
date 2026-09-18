import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    lines: i.text.split(/\r\n|\n/).map((line, index) => {
      const s = line.trim();
      if (s === "") return { index, kind: "blank" };
      if (s.startsWith(";") || s.startsWith("#"))
        return { index, kind: "comment" };
      if (s.startsWith("[")) {
        H.check(s.endsWith("]"));
        const section = s.slice(1, -1).trim();
        H.iniName(section);
        return { index, kind: "section", section };
      }
      return { index, kind: "assignment", ...H.iniAssignment(line) };
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
  id: "ini/line-kind-tokenizer",
  title: "INI Line Kind Tokenizer",
  description:
    "Tokenize restricted INI physical lines into blank/comment/section/trimmed equals assignments; no multiline, escaping, interpolation, inline comments or inheritance.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
