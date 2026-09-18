import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ valueJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "valueJson", label: "valueJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ key: H.typedKey(H.scalar(H.json(i.valueJson))) });
};
export const example = {
  input: { valueJson: '"a:b"' },
  output: { result: { key: "s:3:a:b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "identifier/typed-scalar-key-encoder",
  title: "Typed Scalar Key Encoder",
  description:
    "Encode one JSON scalar into a type-tagged reversible key with explicit UTF-16 string length; rejects arrays/objects and preserves numeric negative zero.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
