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
  const r = H.rotations(i.left),
    reflected = H.rotations(i.left.split("").reverse().join(""));
  return H.finish({
    rotationEquivalent: r.includes(i.right),
    reflectionEquivalent: reflected.includes(i.right),
  });
};
export const example = {
  input: { left: "100", right: "001" },
  output: { result: { rotationEquivalent: true, reflectionEquivalent: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/rhythm-grid-reflection-equivalence",
  title: "Rhythm Grid Reflection Equivalence",
  description:
    "Compare rhythm masks under cyclic rotation and reflected cyclic rotation separately; equal-length matching is implicit.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
