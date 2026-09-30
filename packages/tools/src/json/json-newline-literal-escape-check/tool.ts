import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ fragment: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fragment", label: "Fragment", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    rawLinefeedOffsets: Array.from(i.fragment.matchAll(/\n/g), (m) => m.index!),
    rawCarriageReturnOffsets: Array.from(
      i.fragment.matchAll(/\r/g),
      (m) => m.index!,
    ),
    hasForbiddenRawLineBreak: /[\r\n]/.test(i.fragment),
  });
};
export const example = {
  input: { fragment: "a\nb" },
  output: {
    result: {
      rawLinefeedOffsets: [1],
      rawCarriageReturnOffsets: [],
      hasForbiddenRawLineBreak: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-newline-literal-escape-check",
  title: "JSON: JSON Newline Literal Escape Check Tool",
  description:
    "Locate raw CR/LF code units in a caller-supplied JSON string-content fragment; escaped backslash-n text is not a raw line break and whole-string validity is not inferred.",
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
          hasForbiddenRawLineBreak: { type: "boolean" },
          rawCarriageReturnOffsets: {
            type: "array",
            items: {
              anyOf: [
                { type: "number" },
                { type: "string" },
                { type: "boolean" },
                { type: "null" },
              ],
            },
          },
          rawLinefeedOffsets: { type: "array", items: { type: "number" } },
        },
        required: [
          "hasForbiddenRawLineBreak",
          "rawCarriageReturnOffsets",
          "rawLinefeedOffsets",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
