import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  components,
  collapse,
} from "../batch53-shared.js";

export type Input = Readonly<{ left: string; right: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "Left", kind: "string" },
  { id: "right", label: "Right", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.left.startsWith("/") || !i.right.startsWith("/"))
    simpleError("path", "Absolute POSIX paths.");
  const a = collapse(i.left).components,
    b = collapse(i.right).components;
  let j = 0;
  while (j < a.length && j < b.length && a[j] === b[j]) j++;
  return { ancestor: "/" + a.slice(0, j).join("/"), sharedComponentCount: j };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { left: "/a/b", right: "/a/c" },
  output: { result: { ancestor: "/a", sharedComponentCount: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/component-common-ancestor",
  title: "Path Component Common Ancestor",
  description:
    "Find a lexical component-level common ancestor of normalized absolute POSIX paths; character-prefix and filesystem ancestry are not inferred.",
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
