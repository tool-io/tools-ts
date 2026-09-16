import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  paletteJson: string;
  indexes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "paletteJson", kind: "string", label: "paletteJson" },
  { id: "indexes", kind: "numberList", label: "indexes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.colors(i.paletteJson);
  i.indexes.forEach((x) => H.int(x, 0, p.length - 1));
  const used = H.unique(i.indexes).sort((a, b) => a - b);
  return H.finish({
    palette: used.map((j) => p[j]),
    indexes: i.indexes.map((j) => used.indexOf(j)),
    oldIndexes: used,
  });
};
export const example = {
  input: {
    paletteJson:
      '[{"id":"a","name":"Red","rgba":[255,0,0,255]},{"id":"b","name":"red","rgba":[255,0,0,0]}]',
    indexes: [1, 1],
  },
  output: {
    result: {
      palette: [{ id: "b", name: "red", rgba: [255, 0, 0, 0] }],
      indexes: [0, 0],
      oldIndexes: [1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-used-entry-compactor",
  title: "Palette Used Entry Compactor",
  description:
    "Compact a palette to explicitly used entries in original palette order and remap all indexes, retaining old-index provenance.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
