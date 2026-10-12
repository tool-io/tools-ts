import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ offset: number; alignment: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "offset", kind: "integer", label: "offset" },
  { id: "alignment", kind: "integer", label: "alignment" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.offset);
  H.int(i.alignment, 1);
  const padding = H.mod(-i.offset, i.alignment);
  return H.finish({ padding, alignedOffset: i.offset + padding });
};
export const example = {
  input: { offset: 5, alignment: 4 },
  output: { result: { padding: 3, alignedOffset: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/byte-alignment-padding",
  title: "Byte Alignment Padding",
  description:
    "Compute forward padding to any positive integer byte alignment, not only powers of two.",
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
          padding: { type: "number" },
          alignedOffset: { type: "number" },
        },
        required: ["padding", "alignedOffset"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
