import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ paletteJson: string; order: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "paletteJson", kind: "string", label: "paletteJson" },
  { id: "order", kind: "string", label: "order" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.colors(i.paletteJson);
  H.check(
    i.order.length === 4 &&
      H.unique(i.order.split("")).length === 4 &&
      i.order.split("").every((x) => "RGBA".includes(x)),
  );
  return H.finish({
    rows: p.map((v) => ({
      id: v.id,
      channels: i.order.split("").map((c) => v.rgba["RGBA".indexOf(c)]),
    })),
  });
};
export const example = {
  input: {
    paletteJson:
      '[{"id":"a","name":"Red","rgba":[255,0,0,255]},{"id":"b","name":"red","rgba":[255,0,0,0]}]',
    order: "BGRA",
  },
  output: {
    result: {
      rows: [
        { id: "a", channels: [0, 0, 255, 255] },
        { id: "b", channels: [0, 0, 255, 0] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-channel-order-transcoder",
  title: "Palette Channel Order Transcoder",
  description:
    "Transcode explicit RGBA byte channel order using a complete RGBA permutation; no color transforms or endian interpretation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
