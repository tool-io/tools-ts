import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ paletteJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "paletteJson", kind: "string", label: "paletteJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.colors(i.paletteJson);
  return H.finish({
    indexes: p.flatMap((v, j) =>
      v.rgba[3] === 0 && v.rgba.slice(0, 3).some((x) => x !== 0) ? [j] : [],
    ),
  });
};
export const example = {
  input: {
    paletteJson:
      '[{"id":"a","name":"Red","rgba":[255,0,0,255]},{"id":"b","name":"red","rgba":[255,0,0,0]}]',
  },
  output: { result: { indexes: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-zero-alpha-hidden-color-audit",
  title: "Palette Zero Alpha Hidden Color Audit",
  description:
    "Audit nonzero hidden RGB under zero alpha in explicit palette entries; hidden color is evidence, not necessarily corruption.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
