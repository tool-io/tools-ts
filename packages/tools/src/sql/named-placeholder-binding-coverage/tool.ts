import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  names: readonly string[];
  bindings: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "names", label: "names", kind: "stringList" },
  { id: "bindings", label: "bindings", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    missing: H.unique(i.names.filter((x) => !i.bindings.includes(x))),
    unused: H.unique(i.bindings.filter((x) => !i.names.includes(x))),
    duplicateBindings: H.duplicates(i.bindings, (x) => x),
  });
};
export const example = {
  input: { names: ["a", "b", "a"], bindings: ["a", "c"] },
  output: { result: { missing: ["b"], unused: ["c"], duplicateBindings: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sql/named-placeholder-binding-coverage",
  title: "SQL Named Placeholder Binding Coverage",
  description:
    "Audit explicit placeholder-name versus binding-name coverage, unused bindings and duplicate binding names; does not inspect values or execute SQL.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
