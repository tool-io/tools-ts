import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pointerTokens } from "../batch53-shared.js";

export type Input = Readonly<{ pointer: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pointer", label: "Pointer", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return { tokens: pointerTokens(i.pointer) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { pointer: "/a~1b/~0/" },
  output: { result: { tokens: ["a/b", "~", ""] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/pointer-token-list-parser",
  title: "JSON Pointer Token List Parser",
  description:
    "Parse strict RFC 6901 pointer tokens, preserving empty components and rejecting invalid escapes.",
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
