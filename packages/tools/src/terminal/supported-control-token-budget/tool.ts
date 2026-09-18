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
  const tokens = H.escapeTokens(i.text);
  return H.finish({
    tokens: tokens.map((v) => ({
      start: v.start,
      end: v.end,
      type: v.type,
      complete: v.complete,
      bytes: H.utf8(v.text),
    })),
    controlBytes: tokens.reduce((s, v) => s + H.utf8(v.text), 0),
  });
};
export const example = {
  input: { text: "a\u001b[31mb" },
  output: {
    result: {
      tokens: [{ start: 1, end: 6, type: "CSI", complete: true, bytes: 5 }],
      controlBytes: 5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/supported-control-token-budget",
  title: "Terminal Supported Control Token Budget",
  description:
    "Budget UTF-8 bytes in detected seven-bit ESC/CSI/OSC control tokens with lexical completeness evidence; not a complete supported-terminal command or display-width validator.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
