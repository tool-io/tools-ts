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
    rotation: H.rotations(i.left).includes(i.right),
    reflection: H.rotations(i.left.split("").reverse().join("")).includes(
      i.right,
    ),
  });
};
export const example = {
  input: { left: "abc", right: "acb" },
  output: { result: { rotation: false, reflection: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "string/cyclic-string-reflection-equivalence",
  title: "Cyclic String Reflection Equivalence",
  description:
    "Check exact cyclic string reflection equivalence separately from rotation, using UTF-16 reversal rather than grapheme reversal.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
