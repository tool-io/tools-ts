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
  return H.finish({
    noncharacter:
      (i.codepoint >= 0xfdd0 && i.codepoint <= 0xfdef) ||
      i.codepoint % 65536 >= 65534,
    plane: Math.floor(i.codepoint / 65536),
  });
};
export const example = {
  input: { codepoint: 1114111 },
  output: { result: { noncharacter: true, plane: 16 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/unicode-noncharacter-codepoint",
  title: "Text: Unicode Noncharacter Codepoint Tool",
  description:
    "Inspect one Unicode code point for the designated 66 permanent noncharacters; noncharacters remain scalar values and are not necessarily encoding errors.",
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
          noncharacter: { type: "boolean" },
          plane: { type: "number" },
        },
        required: ["noncharacter", "plane"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
