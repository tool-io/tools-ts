import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch53-shared.js";

export type Input = Readonly<{
  path: string;
  componentIndexes: readonly number[];
  replacement: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "path", label: "Path", kind: "string" },
  { id: "componentIndexes", label: "Component indexes", kind: "numberList" },
  { id: "replacement", label: "Replacement", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.replacement || /[\/\0]/.test(i.replacement))
    simpleError("replacement", "One nonempty literal component.");
  const a = i.path.split("/"),
    nonempty = a.flatMap((v, j) => (v ? [j] : []));
  i.componentIndexes.forEach((v) =>
    bounded(v, "index", 0, nonempty.length - 1),
  );
  const selected = new Set(i.componentIndexes);
  return {
    path: a
      .map((v, j) => (selected.has(nonempty.indexOf(j)) ? i.replacement : v))
      .join("/"),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { path: "/a/b/", componentIndexes: [1], replacement: "X" },
  output: { result: { path: "/a/X/" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/path-component-redaction",
  title: "Path Component Redaction Tool",
  description:
    "Redact explicitly indexed nonempty raw slash components while preserving empty segments and terminal separators.",
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
