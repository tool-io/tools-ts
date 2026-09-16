import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ width: number; fieldsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "width", kind: "integer", label: "width" },
  { id: "fieldsJson", kind: "string", label: "fieldsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.width, 0, 128);
  const r = H.spans(i.fieldsJson);
  r.forEach(([a, b]) => {
    H.int(a, 0, i.width);
    H.int(b, a, i.width);
  });
  const occupied = new Set(
    r.flatMap(([a, b]) => Array.from({ length: b - a }, (_, j) => a + j)),
  );
  return H.finish({
    unusedBits: Array.from({ length: i.width }, (_, j) => j).filter(
      (j) => !occupied.has(j),
    ),
    overlapPairs: H.overlaps(r),
  });
};
export const example = {
  input: { width: 5, fieldsJson: "[[0,2],[3,4]]" },
  output: { result: { unusedBits: [2, 4], overlapPairs: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/bitfield-gap-inventory",
  title: "Bitfield Gap Inventory",
  description:
    "Inventory unoccupied bit positions and positive-width field overlaps in a bounded register; half-open spans.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
