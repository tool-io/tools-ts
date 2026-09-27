import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ byte: number; letterCase: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "byte", label: "Byte", kind: "integer" },
  {
    id: "letterCase",
    label: "Letter case",
    kind: "string",
    enum: ["upper", "lower"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.byte, 0, 255);
  H.choice(i.letterCase, ["upper", "lower"]);
  return H.finish({
    label:
      i.letterCase === "upper" ? H.hex(i.byte) : H.hex(i.byte).toLowerCase(),
  });
};
export const example = {
  input: { byte: 175, letterCase: "lower" },
  output: { result: { label: "af" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/hexadecimal-byte-case-label",
  title: "Formatting: Hexadecimal Byte Case Label Tool",
  description:
    "Format one unsigned byte as exactly two hexadecimal digits under an explicit case policy; no text or word encoding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string" } },
        required: ["label"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
