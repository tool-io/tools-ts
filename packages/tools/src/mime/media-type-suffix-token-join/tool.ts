import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ base: string; suffix: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "base", label: "base", kind: "string" },
  { id: "suffix", label: "suffix", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(H.token(i.base) && H.token(i.suffix) && !i.suffix.includes("+"));
  return H.finish({ subtype: i.base + "+" + i.suffix });
};
export const example = {
  input: { base: "problem", suffix: "json" },
  output: { result: { subtype: "problem+json" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Media Type Suffix Token Join", "MIME", "encoding"],
    collections: ["encode-decode"],
    fields: ["MIME", "encoding"],
    keywords: ["MIME", "encoding"],
  },
  id: "mime/media-type-suffix-token-join",
  title: "Media Type Suffix Token Join",
  description:
    "Join explicit nonempty MIME subtype and structured-suffix tokens with one plus; caller verifies registration, no serialization of a complete Content-Type.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { subtype: { type: "string" } },
        required: ["subtype"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
