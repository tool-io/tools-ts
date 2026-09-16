import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, lines } from "../batch53-shared.js";

export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const m = /(?:\r\n|\r|\n)+$/.exec(i.text);
  return {
    hasTerminalNewline: !!m,
    terminalSequence: m?.[0] ?? "",
    terminalNewlineCount: m ? lines(m[0]).length - 1 : 0,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "a\r\n" },
  output: {
    result: {
      hasTerminalNewline: true,
      terminalSequence: "\r\n",
      terminalNewlineCount: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/terminal-newline-classifier",
  title: "Terminal Newline Classifier",
  description:
    "Classify the exact terminal CR, LF and CRLF newline sequence without normalization or trimming other whitespace.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
