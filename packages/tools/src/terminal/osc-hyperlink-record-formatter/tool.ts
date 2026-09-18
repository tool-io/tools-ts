import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ target: string; text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "target", label: "target", kind: "string" },
  { id: "text", label: "text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.target.length > 0 && !/[\u0000-]/.test(i.target + i.text));
  const esc = String.fromCharCode(27),
    st = String.fromCharCode(27, 92);
  return H.finish({
    token: esc + "]8;;" + i.target + st + i.text + esc + "]8;;" + st,
  });
};
export const example = {
  input: { target: "https://example.test", text: "link" },
  output: {
    result: {
      token: "\u001b]8;;https://example.test\u001b\\link\u001b]8;;\u001b\\",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/osc-hyperlink-record-formatter",
  title: "Terminal OSC Hyperlink Record Formatter",
  description:
    "Format one OSC 8 hyperlink record using ST delimiters, rejecting controls in target/display text; no URL safety, terminal support or link activation guarantee.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
