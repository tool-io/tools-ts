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
  return H.finish({
    offsets: H.rotations(i.left).flatMap((s, j) => (s === i.right ? [j] : [])),
  });
};
export const example = {
  input: { left: "abab", right: "baba" },
  output: { result: { offsets: [1, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "string/cyclic-rotation-offsets",
  title: "String Cyclic Rotation Offsets",
  description:
    "Return all cyclic left-rotation offsets mapping one UTF-16 string to another; all tied witnesses are retained, including periodic strings.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
