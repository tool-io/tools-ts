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
    violations: p.flatMap((v, index) =>
      v.rgba.slice(0, 3).some((x) => x > v.rgba[3])
        ? [{ index, id: v.id }]
        : [],
    ),
  });
};
export const example = {
  input: {
    paletteJson:
      '[{"id":"a","name":"Red","rgba":[255,0,0,255]},{"id":"b","name":"red","rgba":[255,0,0,0]}]',
  },
  output: { result: { violations: [{ index: 1, id: "b" }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-premultiplication-consistency",
  title: "Palette Premultiplication Consistency Check",
  description:
    "Check necessary byte-range consistency for purported premultiplied RGB channels not exceeding alpha; passing does not prove correct premultiplication.",
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
          violations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: { index: { type: "number" }, id: { type: "string" } },
              required: ["index", "id"],
            },
          },
        },
        required: ["violations"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
