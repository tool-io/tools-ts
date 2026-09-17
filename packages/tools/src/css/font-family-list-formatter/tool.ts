import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ families: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "families", label: "families", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.families.length > 0 &&
      i.families.every((s) => s.length > 0 && !/[\u0000-]/.test(s)),
  );
  return H.finish({
    text: i.families.map((s) => JSON.stringify(s)).join(", "),
  });
};
export const example = {
  input: { families: ["A B", "serif"] },
  output: { result: { text: '"A B", "serif"' } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/font-family-list-formatter",
  title: "CSS Font Family List Formatter",
  description:
    "Format literal font family names as double-quoted escaped CSS strings using JSON-compatible escapes; control characters are rejected, generic keywords become literal family names.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
