import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^<(0|[1-9]\d{0,2})>(?![\s\S])/.exec(i.token);
  H.check(m);
  H.int(Number(m![1]), 0, 191);
  return H.finish({ priority: Number(m![1]) });
};
export const example = {
  input: { token: "<165>" },
  output: { result: { priority: 165 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "log/syslog-priority-token-parser",
  title: "Syslog Priority Token Parser",
  description:
    "Parse or format one complete RFC 5424 syslog priority token in the 0\u2013191 range; no full message parsing.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
