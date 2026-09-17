import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ classLists: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "classLists", kind: "stringList", label: "classLists" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    classes: H.unique(i.classLists.flatMap(H.classTokens)).join(" "),
  });
};
export const example = {
  input: { classLists: ["a b", "b\tc"] },
  output: { result: { classes: "a b c" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/class-token-stable-merge",
  title: "HTML Class Token Stable Merge",
  description:
    "Merge explicit HTML class attribute strings as stable exact token union after ASCII whitespace tokenization; preserve first token appearance.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
