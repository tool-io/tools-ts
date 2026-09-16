import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  pointerTokens,
  pointerFormat,
} from "../batch53-shared.js";

export type Input = Readonly<{
  pointer: string;
  oldBase: string;
  newBase: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pointer", label: "Pointer", kind: "string" },
  { id: "oldBase", label: "Old base", kind: "string" },
  { id: "newBase", label: "New base", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = pointerTokens(i.pointer),
    b = pointerTokens(i.oldBase),
    c = pointerTokens(i.newBase);
  if (b.length > a.length || !b.every((v, j) => v === a[j]))
    simpleError("base", "Old base must be a token prefix.");
  return { pointer: pointerFormat([...c, ...a.slice(b.length)]) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { pointer: "/a/b", oldBase: "/a", newBase: "/x" },
  output: { result: { pointer: "/x/b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/pointer-rebase",
  title: "JSON Pointer Rebase Tool",
  description:
    "Rebase an RFC 6901 pointer by replacing a decoded-token prefix; reject paths outside the old base.",
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
