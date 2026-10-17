import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ contentId: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "contentId", label: "contentId", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(/^[^<>@\s]+@[^<>@\s]+(?![\s\S])/.test(i.contentId));
  return H.finish({ token: "<" + i.contentId + ">" });
};
export const example = {
  input: { contentId: "a@b" },
  output: { result: { token: "<a@b>" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Content ID Bracket Token Formatter", "MIME", "encoding"],
    collections: ["encode-decode"],
    fields: ["MIME", "encoding"],
    keywords: ["MIME", "encoding"],
  },
  id: "mime/content-id-bracket-token-formatter",
  title: "Content ID Bracket Token Formatter",
  description:
    "Format one restricted nonempty local@domain Content-ID in angle brackets; no uniqueness, message identity or full RFC mailbox syntax inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string" } },
        required: ["token"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
