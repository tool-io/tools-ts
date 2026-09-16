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

export type Input = Readonly<{ baseDirectory: string; relativePath: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "baseDirectory", label: "Base directory", kind: "string" },
  { id: "relativePath", label: "Relative path", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.baseDirectory.startsWith("/") || i.relativePath.startsWith("/"))
    simpleError("path", "Absolute base directory and relative target.");
  const out = collapse(i.baseDirectory + "/" + i.relativePath);
  return { path: "/" + out.components.join("/") };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { baseDirectory: "/a/b", relativePath: "../c" },
  output: { result: { path: "/a/c" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/relative-path-component-resolver",
  title: "Relative Path Component Resolver",
  description:
    "Lexically resolve a relative POSIX path against an absolute directory with dot collapse; no symlink or actual-file resolution.",
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
