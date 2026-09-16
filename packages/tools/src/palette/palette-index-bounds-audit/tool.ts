import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  paletteSize: number;
  indexes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "paletteSize", kind: "integer", label: "paletteSize" },
  { id: "indexes", kind: "numberList", label: "indexes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.paletteSize, 0, 128);
  i.indexes.forEach((x) => H.int(x, -1e9, 1e9));
  return H.finish({
    violations: i.indexes.flatMap((x, j) =>
      x < 0 || x >= i.paletteSize ? [{ index: j, value: x }] : [],
    ),
  });
};
export const example = {
  input: { paletteSize: 2, indexes: [0, 2, -1] },
  output: {
    result: {
      violations: [
        { index: 1, value: 2 },
        { index: 2, value: -1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-index-bounds-audit",
  title: "Palette Index Bounds Audit",
  description:
    "Audit signed integer palette-index bounds without rejecting the whole observation or mutating index data.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
