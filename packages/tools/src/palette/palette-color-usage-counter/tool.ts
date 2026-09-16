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
  return H.finish({
    usage: p.map((v, j) => ({
      id: v.id,
      count: i.indexes.filter((x) => x === j).length,
    })),
  });
};
export const example = {
  input: {
    paletteJson:
      '[{"id":"a","name":"Red","rgba":[255,0,0,255]},{"id":"b","name":"red","rgba":[255,0,0,0]}]',
    indexes: [1, 1, 0],
  },
  output: {
    result: {
      usage: [
        { id: "a", count: 1 },
        { id: "b", count: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-color-usage-counter",
  title: "Palette Color Usage Counter",
  description:
    "Count explicit palette-index usage including unused entries; rejects unknown indexes rather than guessing nearest colors.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
