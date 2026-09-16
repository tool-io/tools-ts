import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ paletteJson: string; bits: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "paletteJson", kind: "string", label: "paletteJson" },
  { id: "bits", kind: "integer", label: "bits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.colors(i.paletteJson);
  H.int(i.bits, 1, 8);
  const q = (x: number) => Math.floor(x / 2 ** (8 - i.bits));
  return H.finish({
    collisions: H.duplicates(p, (v) =>
      JSON.stringify(v.rgba.slice(0, 3).map(q)),
    ),
  });
};
export const example = {
  input: {
    paletteJson:
      '[{"id":"a","name":"Red","rgba":[255,0,0,255]},{"id":"b","name":"red","rgba":[255,0,0,0]}]',
    bits: 4,
  },
  output: { result: { collisions: [{ key: "[15,0,0]", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-channel-quantization-collision",
  title: "Palette Channel Quantization Collision Table",
  description:
    "Audit RGB collisions after truncating each byte to a supplied high-bit precision; alpha is explicitly excluded.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
