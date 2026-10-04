import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ codepoint: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "codepoint", label: "Codepoint", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.codepoint, 0, 0x10ffff);
  const area =
    i.codepoint >= 0xe000 && i.codepoint <= 0xf8ff
      ? "BMP"
      : i.codepoint >= 0xf0000 && i.codepoint <= 0xffffd
        ? "plane-15"
        : i.codepoint >= 0x100000 && i.codepoint <= 0x10fffd
          ? "plane-16"
          : "none";
  return H.finish({ privateUse: area !== "none", area });
};
export const example = {
  input: { codepoint: 57344 },
  output: { result: { privateUse: true, area: "BMP" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/unicode-private-use-plane-label",
  title: "Text: Unicode Private Use Plane Label Tool",
  description:
    "Classify the three Unicode private-use areas without assigning character semantics or confusing supplementary-plane terminal noncharacters with private use.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          area: { type: "string" },
          privateUse: { type: "boolean" },
        },
        required: ["area", "privateUse"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
