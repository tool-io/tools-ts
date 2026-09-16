import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{
  path: string;
  fromSeparator: string;
  toSeparator: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "path", label: "Path", kind: "string" },
  { id: "fromSeparator", label: "From separator", kind: "string" },
  { id: "toSeparator", label: "To separator", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (
    i.fromSeparator.length !== 1 ||
    i.toSeparator.length !== 1 ||
    i.fromSeparator === i.toSeparator
  )
    simpleError("separator", "Distinct one-unit separators.");
  return { path: i.path.replaceAll(i.fromSeparator, i.toSeparator) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { path: "a\\b", fromSeparator: "\\", toSeparator: "/" },
  output: { result: { path: "a/b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/path-separator-transcode",
  title: "Lexical Path Separator Transcoder",
  description:
    "Transcode literal path separators only, without drive, UNC, root, escape, symlink or filesystem semantics.",
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
