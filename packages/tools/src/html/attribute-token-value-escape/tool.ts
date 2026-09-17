import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ value: string; quote: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", kind: "string", label: "value" },
  { id: "quote", kind: "string", label: "quote" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ escaped: H.attributeEscape(i.value, i.quote) });
};
export const example = {
  input: { value: 'a"<&', quote: '"' },
  output: { result: { escaped: "a&quot;&lt;&amp;" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/attribute-token-value-escape",
  title: "HTML Attribute Token Value Escape",
  description:
    "Escape an explicit HTML quoted attribute value for a selected quote character, including ampersand and angle brackets; not a URL, script or style sanitizer.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
