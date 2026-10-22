import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ target: string; text: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "target", label: "target", kind: "string" },
  { id: "text", label: "text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
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
  discovery: {
    aliases: [
      "Terminal OSC Hyperlink Record Formatter",
      "terminal escape sequences",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["terminal", "terminal escape sequences", "software development"],
    keywords: ["terminal escape sequences", "software development"],
  },
  id: "terminal/osc-hyperlink-record-formatter",
  title: "Terminal OSC Hyperlink Record Formatter",
  description:
    "Format one OSC 8 hyperlink record using ST delimiters, rejecting controls in target/display text; no URL safety, terminal support or link activation guarantee.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string" } },
        required: ["token"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
