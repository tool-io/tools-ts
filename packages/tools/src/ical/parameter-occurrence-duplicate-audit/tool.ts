import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ parametersJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "parametersJson", label: "parametersJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.records(i.parametersJson).map((v) => {
    const name = H.str(v.name);
    H.icalName(name);
    return { name: name.toUpperCase(), value: H.str(v.value) };
  });
  return H.finish({ duplicates: H.duplicates(r, (v) => v.name) });
};
export const example = {
  input: {
    parametersJson: '[{"name":"TZID","value":"x"},{"name":"tzid","value":"y"}]',
  },
  output: { result: { duplicates: [{ key: "TZID", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["iCalendar Parameter Duplicate Audit", "iCalendar", "calendars"],
    collections: ["encode-decode"],
    fields: ["ical", "iCalendar", "calendars"],
    keywords: ["iCalendar", "calendars"],
  },
  id: "ical/parameter-occurrence-duplicate-audit",
  title: "iCalendar Parameter Duplicate Audit",
  description:
    "Audit explicit iCalendar parameter occurrences under case-insensitive names, preserving caller-supplied values and occurrence indexes; no HTTP parameter grammar reused.",
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
          duplicates: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: { type: "string" },
                indexes: { type: "array", items: { type: "number" } },
              },
              required: ["key", "indexes"],
            },
          },
        },
        required: ["duplicates"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
