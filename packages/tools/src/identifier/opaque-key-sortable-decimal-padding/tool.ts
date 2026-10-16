import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ ordinal: string; width: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "ordinal", label: "ordinal", kind: "string" },
  { id: "width", label: "width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const v = H.bigint(i.ordinal);
  H.int(i.width, 1, 256);
  H.check(v >= 0n && String(v).length <= i.width);
  return H.finish({ key: String(v).padStart(i.width, "0") });
};
export const example = {
  input: { ordinal: "9007199254740993", width: 18 },
  output: { result: { key: "009007199254740993" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Opaque Key Sortable Decimal Padding",
      "identifiers",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["identifier", "identifiers", "software development"],
    keywords: ["identifiers", "software development"],
  },
  id: "identifier/opaque-key-sortable-decimal-padding",
  title: "Opaque Key Sortable Decimal Padding",
  description:
    "Format an exact unsigned decimal ordinal as a bounded fixed-width lexicographically sortable key, rejecting overflow; unsafe integers require text.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { key: { type: "string" } },
        required: ["key"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
