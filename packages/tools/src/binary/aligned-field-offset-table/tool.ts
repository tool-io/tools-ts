import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  lengths: readonly number[];
  alignments: readonly number[];
  initialOffset: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lengths", kind: "numberList", label: "lengths" },
  { id: "alignments", kind: "numberList", label: "alignments" },
  { id: "initialOffset", kind: "integer", label: "initialOffset" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.initialOffset);
  H.check(i.lengths.length === i.alignments.length);
  let offset = i.initialOffset;
  const layout = i.lengths.map((length, j) => {
    H.int(length);
    H.int(i.alignments[j], 1);
    const padding = H.mod(-offset, i.alignments[j]);
    offset += padding;
    const start = offset;
    offset += length;
    return { start, end: offset, padding };
  });
  return H.finish({ fields: layout, endOffset: offset });
};
export const example = {
  input: { lengths: [1, 2], alignments: [1, 4], initialOffset: 0 },
  output: {
    result: {
      fields: [
        { start: 0, end: 1, padding: 0 },
        { start: 4, end: 6, padding: 3 },
      ],
      endOffset: 6,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/aligned-field-offset-table",
  title: "Aligned Field Offset Table",
  description:
    "Lay out explicit byte field lengths with per-field integer alignment and report every padding gap; no ABI inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
