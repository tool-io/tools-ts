import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  components,
} from "../batch53-shared.js";

export type Input = Readonly<{ path: string; prefix: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "path", label: "Path", kind: "string" },
  { id: "prefix", label: "Prefix", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (/[?#]/.test(i.path + i.prefix))
    simpleError("path", "Raw path components only.");
  const a = i.path.split("/"),
    b = i.prefix.split("/");
  return { matches: b.length <= a.length && b.every((v, j) => v === a[j]) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { path: "/abc/x", prefix: "/ab" },
  output: { result: { matches: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/url-path-prefix-token-match",
  title: "URL Path Prefix Token Match",
  description:
    "Check a literal raw URL-path segment prefix, retaining empty segments and rejecting accidental character-prefix matches.",
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
