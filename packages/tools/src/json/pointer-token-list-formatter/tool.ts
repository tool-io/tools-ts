import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pointerFormat } from "../batch53-shared.js";

export type Input = Readonly<{ tokens: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tokens", label: "Tokens", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return { pointer: pointerFormat(i.tokens) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { tokens: ["a/b", "~", ""] },
  output: { result: { pointer: "/a~1b/~0/" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/pointer-token-list-formatter",
  title: "JSON Pointer Token List Formatter",
  description:
    "Format an explicit token list as an RFC 6901 pointer; an empty list is root and an empty token is an actual slash component.",
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
