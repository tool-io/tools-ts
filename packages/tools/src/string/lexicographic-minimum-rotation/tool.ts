import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", kind: "string", label: "text" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.rotations(i.text),
    value = [...r].sort()[0];
  return H.finish({
    value,
    offsets: r.flatMap((s, j) => (s === value ? [j] : [])),
  });
};
export const example = {
  input: { text: "baba" },
  output: { result: { value: "abab", offsets: [1, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "string/lexicographic-minimum-rotation",
  title: "Lexicographic Minimum String Rotation",
  description:
    "Bounded UTF-16 string lexicographic minimum string rotation; exact code-unit matching, no Unicode normalization or grapheme inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
