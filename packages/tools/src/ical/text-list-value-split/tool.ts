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
  const parts = [""];
  for (let j = 0; j < i.text.length; j++) {
    const c = i.text[j];
    if (c === "\\") {
      H.check(j + 1 < i.text.length);
      parts[parts.length - 1] += c + i.text[++j];
    } else if (c === ",") parts.push("");
    else parts[parts.length - 1] += c;
  }
  H.check(parts.length <= 128);
  return H.finish({ values: parts.map(H.icalUnescape) });
};
export const example = {
  input: { text: "a\\,b,c" },
  output: { result: { values: ["a,b", "c"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["iCalendar Text List Value Splitter", "iCalendar", "calendars"],
    collections: ["encode-decode"],
    fields: ["ical", "iCalendar", "calendars"],
    keywords: ["iCalendar", "calendars"],
  },
  id: "ical/text-list-value-split",
  title: "iCalendar Text List Value Splitter",
  description:
    "Split an iCalendar TEXT-list only at unescaped commas, then decode defined TEXT escapes; repeated empty elements remain explicit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { values: { type: "array", items: { type: "string" } } },
        required: ["values"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
