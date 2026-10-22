import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{
  text: string;
  newline: string;
  enabled: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "newline", label: "Newline", kind: "string" },
  { id: "enabled", label: "Enabled", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  if (!["\n", "\r", "\r\n"].includes(i.newline))
    simpleError("newline", "CR, LF or CRLF.");
  const base = i.text.replace(/(?:\r\n|\r|\n)+$/, "");
  return { text: base + (i.enabled ? i.newline : "") };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "a\n\n", newline: "\r\n", enabled: true },
  output: { result: { text: "a\r\n" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/terminal-newline-enforcer",
  title: "Terminal Newline Enforcer",
  description:
    "Enforce exactly one supplied terminal newline or none; internal line endings and non-newline suffix whitespace are preserved.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string" } },
        required: ["text"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
