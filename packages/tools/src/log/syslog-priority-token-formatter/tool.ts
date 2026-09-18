import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ priority: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "priority", label: "priority", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.priority, 0, 191);
  return H.finish({ token: "<" + i.priority + ">" });
};
export const example = {
  input: { priority: 165 },
  output: { result: { token: "<165>" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "log/syslog-priority-token-formatter",
  title: "Syslog Priority Token Formatter",
  description:
    "Parse or format one complete RFC 5424 syslog priority token in the 0\u2013191 range; no full message parsing.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
