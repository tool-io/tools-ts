import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "text", label: "text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const spans: number[][] = [];
  const unfolded = i.text.replace(/\r\n[ \t]/g, (s: string, offset: number) => {
    spans.push([offset, offset + s.length]);
    return "";
  });
  return H.finish({ unfolded, removedSpans: spans });
};
export const example = {
  input: { text: "ab\r\n cd\r\n\te" },
  output: {
    result: {
      unfolded: "abcde",
      removedSpans: [
        [2, 5],
        [7, 10],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["iCalendar Line Unfold Span Map", "iCalendar", "calendars"],
    collections: ["encode-decode"],
    fields: ["ical", "iCalendar", "calendars"],
    keywords: ["iCalendar", "calendars"],
  },
  id: "ical/content-line-unfold-spans",
  title: "iCalendar Line Unfold Span Map",
  description:
    "Unfold iCalendar CRLF followed by exactly one SP/HTAB and report removed source spans; unrelated line endings remain unchanged.",
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
          unfolded: { type: "string" },
          removedSpans: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["unfolded", "removedSpans"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
