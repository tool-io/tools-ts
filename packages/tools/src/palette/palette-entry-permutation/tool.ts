import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  paletteJson: string;
  permutation: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "paletteJson", kind: "string", label: "paletteJson" },
  { id: "permutation", kind: "numberList", label: "permutation" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.colors(i.paletteJson);
  H.permutation(i.permutation);
  H.check(i.permutation.length === p.length);
  return H.finish({
    palette: i.permutation.map((j) => p[j]),
    oldToNew: p.map((_, j) => i.permutation.indexOf(j)),
  });
};
export const example = {
  input: {
    paletteJson:
      '[{"id":"a","name":"Red","rgba":[255,0,0,255]},{"id":"b","name":"red","rgba":[255,0,0,0]}]',
    permutation: [1, 0],
  },
  output: {
    result: {
      palette: [
        { id: "b", name: "red", rgba: [255, 0, 0, 0] },
        { id: "a", name: "Red", rgba: [255, 0, 0, 255] },
      ],
      oldToNew: [1, 0],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-entry-permutation",
  title: "Palette Entry Permutation Tool",
  description:
    "Permute palette entries using output-to-input ordering and report the inverse remapping for existing indexed pixels.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
