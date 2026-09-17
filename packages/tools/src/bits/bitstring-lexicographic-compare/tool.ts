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
  H.bits(i.left);
  H.bits(i.right);
  return H.finish({ order: i.left < i.right ? -1 : i.left > i.right ? 1 : 0 });
};
export const example = {
  input: { left: "1", right: "01" },
  output: { result: { order: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-lexicographic-compare",
  title: "Bit String Lexicographic Compare",
  description:
    "Compare bit strings lexicographically as text, not by numeric magnitude; differing widths and leading zeros remain significant.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
