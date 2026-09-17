import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^-[A-Za-z][\s\S]+(?![\s\S])/.test(i.token));
  return H.finish({ option: i.token.slice(0, 2), value: i.token.slice(2) });
};
export const example = {
  input: { token: "-Iinclude" },
  output: { result: { option: "-I", value: "include" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "arguments/short-option-attached-value-split",
  title: "Short Option Attached Value Splitter",
  description:
    "Split an explicit short-option attached-value token after its one ASCII option letter; no equals stripping or option-schema inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
