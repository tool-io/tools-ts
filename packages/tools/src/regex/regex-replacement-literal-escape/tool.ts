import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ literal: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "literal", kind: "string", label: "literal" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ replacement: i.literal.replace(/\$/g, "$$$$") });
};
export const example = {
  input: { literal: "$1 $&" },
  output: { result: { replacement: "$$1 $$&" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/regex-replacement-literal-escape",
  title: "Regex Replacement Literal Escape",
  description:
    "Escape every dollar sign for literal ECMAScript string replacement; unlike regex pattern escaping this preserves replacement text semantics.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
