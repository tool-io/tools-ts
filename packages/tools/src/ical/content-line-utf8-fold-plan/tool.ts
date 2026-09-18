import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ line: string; limit: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "line", label: "line", kind: "string" },
  { id: "limit", label: "limit", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.limit, 5, 75);
  H.check(!/[\r\n]/.test(i.line));
  const lines: string[] = [];
  let current = "",
    bytes = 0;
  for (const c of i.line) {
    const size = H.utf8(c);
    if (bytes + size > i.limit) {
      lines.push(current);
      current = " ";
      bytes = 1;
    }
    current += c;
    bytes += size;
  }
  lines.push(current);
  return H.finish({ lines, folded: lines.join("\r\n") });
};
export const example = {
  input: { line: "abcd\u00e9x", limit: 5 },
  output: {
    result: { lines: ["abcd", " \u00e9x"], folded: "abcd\r\n \u00e9x" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/content-line-utf8-fold-plan",
  title: "iCalendar UTF-8 Line Fold Plan",
  description:
    "Fold a single iCalendar content line without splitting Unicode code points, budgeting UTF-8 octets including one continuation space; limit 5\u201375, no CRLF terminator added.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
