import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pointerTokens } from "../batch53-shared.js";

export type Input = Readonly<{ prefix: string; pointer: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "prefix", label: "Prefix", kind: "string" },
  { id: "pointer", label: "Pointer", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = pointerTokens(i.prefix),
    b = pointerTokens(i.pointer),
    prefix = a.length <= b.length && a.every((v, j) => v === b[j]);
  return { isPrefix: prefix, equal: prefix && a.length === b.length };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { prefix: "/a", pointer: "/ab" },
  output: { result: { isPrefix: false, equal: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/pointer-prefix-relation",
  title: "JSON Pointer Prefix Relation",
  description:
    "Compare decoded pointer token prefixes, never raw string prefixes; root prefixes every valid pointer.",
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
