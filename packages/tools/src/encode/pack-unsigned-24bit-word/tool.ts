import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ value: number; byteOrder: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "Value", kind: "integer" },
  {
    id: "byteOrder",
    label: "Byte order",
    kind: "string",
    enum: ["big", "little"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.value, 0, 0xffffff);
  H.choice(i.byteOrder, ["big", "little"]);
  const bytes = [
    Math.floor(i.value / 65536),
    Math.floor(i.value / 256) % 256,
    i.value % 256,
  ];
  return H.finish({ bytes: i.byteOrder === "big" ? bytes : bytes.reverse() });
};
export const example = {
  input: { value: 1193046, byteOrder: "big" },
  output: { result: { bytes: [18, 52, 86] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/pack-unsigned-24bit-word",
  title: "Encoding: Pack Unsigned 24bit Word Tool",
  description:
    "Pack one unsigned 24-bit integer into exactly three bytes under an explicit byte order.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { bytes: { type: "array", items: { type: "number" } } },
        required: ["bytes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
