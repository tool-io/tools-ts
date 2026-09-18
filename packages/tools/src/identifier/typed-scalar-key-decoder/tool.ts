import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ key: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "key", label: "key", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ value: H.untypedKey(i.key) });
};
export const example = {
  input: { key: "s:3:a:b" },
  output: { result: { value: "a:b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "identifier/typed-scalar-key-decoder",
  title: "Typed Scalar Key Decoder",
  description:
    "Decode the explicit type-tagged scalar key dialect, validating canonical finite number spellings and exact UTF-16 string lengths.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
