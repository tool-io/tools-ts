import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ value: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "value", label: "value", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  let start = 0,
    end = i.value.length;
  while (start < end && /[ \t]/.test(i.value[start])) start++;
  while (end > start && /[ \t]/.test(i.value[end - 1])) end--;
  return H.finish({
    leading: [0, start],
    value: [start, end],
    trailing: [end, i.value.length],
  });
};
export const example = {
  input: { value: " \ta \t" },
  output: { result: { leading: [0, 2], value: [2, 3], trailing: [3, 5] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "HTTP Header Outer Whitespace Span Map",
      "HTTP",
      "web development",
    ],
    collections: ["encode-decode"],
    fields: ["HTTP", "web development"],
    keywords: ["HTTP", "web development"],
  },
  id: "http/header-ows-span-map",
  title: "HTTP Header Outer Whitespace Span Map",
  description:
    "Map leading/core/trailing HTTP optional whitespace spans, recognizing SP and HTAB only and preserving raw UTF-16 coordinates.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leading: { type: "array", items: { type: "number" } },
          value: { type: "array", items: { type: "number" } },
          trailing: { type: "array", items: { type: "number" } },
        },
        required: ["leading", "value", "trailing"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
