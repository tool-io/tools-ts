import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ value: string; important: boolean }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "value", kind: "string" },
  { id: "important", label: "important", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const v = H.important(i.value);
  return H.finish({ value: v.value + (i.important ? " !important" : "") });
};
export const example = {
  input: { value: "red !important", important: false },
  output: { result: { value: "red" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/declaration-important-suffix-formatter",
  title: "CSS Important Suffix Formatter",
  description:
    "Replace a top-level important suffix using an explicit flag without duplicating it; restricted comment-free balanced CSS values.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
