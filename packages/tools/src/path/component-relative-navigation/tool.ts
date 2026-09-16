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

export type Input = Readonly<{ fromDirectory: string; toPath: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fromDirectory", label: "From directory", kind: "string" },
  { id: "toPath", label: "To path", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.fromDirectory.startsWith("/") || !i.toPath.startsWith("/"))
    simpleError("path", "Absolute POSIX paths.");
  const a = collapse(i.fromDirectory).components,
    b = collapse(i.toPath).components;
  let j = 0;
  while (j < a.length && j < b.length && a[j] === b[j]) j++;
  const c = [...Array(a.length - j).fill(".."), ...b.slice(j)];
  return { relativePath: c.length ? c.join("/") : "." };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { fromDirectory: "/a/b", toPath: "/a/c" },
  output: { result: { relativePath: "../c" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/component-relative-navigation",
  title: "Path Component Relative Navigation",
  description:
    "Plan lexical relative component navigation between absolute POSIX paths; no filesystem or symlink equivalence claim.",
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
