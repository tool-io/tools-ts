import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    continuedText: i.text.replace(/\\\n/g, ""),
    removedContinuations: (i.text.match(/\\\n/g) ?? []).length,
  });
};
export const example = {
  input: { text: "a\\\nb" },
  output: { result: { continuedText: "ab", removedContinuations: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/shell-back-slash-newline-token",
  title: "Parsing: Shell Back Slash Newline Token Tool",
  description:
    "Remove literal backslash-LF continuations from a caller-established unquoted shell fragment; excludes shell parsing, quoted contexts and CRLF normalization.",
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
          continuedText: { type: "string" },
          removedContinuations: { type: "number" },
        },
        required: ["continuedText", "removedContinuations"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
