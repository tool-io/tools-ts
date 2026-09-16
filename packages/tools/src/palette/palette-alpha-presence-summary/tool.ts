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
    transparent: p.filter((v) => v.rgba[3] === 0).length,
    opaque: p.filter((v) => v.rgba[3] === 255).length,
    partial: p.filter((v) => v.rgba[3] > 0 && v.rgba[3] < 255).length,
  });
};
export const example = {
  input: {
    paletteJson:
      '[{"id":"a","name":"Red","rgba":[255,0,0,255]},{"id":"b","name":"red","rgba":[255,0,0,0]}]',
  },
  output: { result: { transparent: 1, opaque: 1, partial: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-alpha-presence-summary",
  title: "Palette Alpha Presence Summary",
  description:
    "Count transparent, opaque and partially transparent RGBA palette byte entries; no compositing or color-space conversion.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
