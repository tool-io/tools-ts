import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{
  path: string;
  requireTerminalSeparator: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "path", label: "Path", kind: "string" },
  {
    id: "requireTerminalSeparator",
    label: "Require terminal separator",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (i.path.includes("\0")) simpleError("path", "NUL unsupported.");
  const base = i.path.replace(/\/+$/, "");
  return {
    path: i.requireTerminalSeparator
      ? base + "/"
      : base || (i.path.startsWith("/") ? "/" : ""),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { path: "a///", requireTerminalSeparator: false },
  output: { result: { path: "a" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/path-terminal-separator-policy",
  title: "Path Terminal Separator Policy",
  description:
    "Enforce a literal POSIX terminal slash policy while preserving absolute root; no directory existence claim.",
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
