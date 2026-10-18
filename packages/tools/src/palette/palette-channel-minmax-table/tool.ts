import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ paletteJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "paletteJson", kind: "string", label: "paletteJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const p = H.colors(i.paletteJson);
  return H.finish({
    channels: ["red", "green", "blue", "alpha"].map((channel, j) => ({
      channel,
      minimum: p.length ? Math.min(...p.map((v) => v.rgba[j])) : null,
      maximum: p.length ? Math.max(...p.map((v) => v.rgba[j])) : null,
    })),
  });
};
export const example = {
  input: {
    paletteJson:
      '[{"id":"a","name":"Red","rgba":[255,0,0,255]},{"id":"b","name":"red","rgba":[255,0,0,0]}]',
  },
  output: {
    result: {
      channels: [
        { channel: "red", minimum: 255, maximum: 255 },
        { channel: "green", minimum: 0, maximum: 0 },
        { channel: "blue", minimum: 0, maximum: 0 },
        { channel: "alpha", minimum: 0, maximum: 255 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-channel-minmax-table",
  title: "Palette Channel Minmax Table",
  description:
    "Report observed per-channel RGBA byte extrema, using null for an empty palette rather than invented bounds.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          channels: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                channel: { type: "string" },
                minimum: { anyOf: [{ type: "number" }, { type: "null" }] },
                maximum: { anyOf: [{ type: "number" }, { type: "null" }] },
              },
              required: ["channel", "minimum", "maximum"],
            },
          },
        },
        required: ["channels"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
