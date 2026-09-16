import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bits", kind: "string", label: "bits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bits(i.bits);
  const r = H.rotations(i.bits),
    canonical = [...r].sort()[0];
  return H.finish({
    canonical,
    offsets: r.flatMap((s, j) => (s === canonical ? [j] : [])),
  });
};
export const example = {
  input: { bits: "1010" },
  output: { result: { canonical: "0101", offsets: [1, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/rhythm-grid-rotation-canonicalizer",
  title: "Rhythm Grid Rotation Canonicalizer",
  description:
    "Canonicalize a rhythm step mask by lexicographic cyclic rotation and retain every tied rotation offset.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
