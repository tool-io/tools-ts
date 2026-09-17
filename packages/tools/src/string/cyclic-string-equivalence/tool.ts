import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ left: string; right: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", kind: "string", label: "left" },
  { id: "right", kind: "string", label: "right" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ equivalent: H.rotations(i.left).includes(i.right) });
};
export const example = {
  input: { left: "abc", right: "bca" },
  output: { result: { equivalent: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "string/cyclic-string-equivalence",
  title: "Cyclic String Equivalence Check",
  description:
    "Check exact cyclic UTF-16 string equivalence without normalization; empty strings are equivalent to each other.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
