import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  properties: readonly string[];
  rulesJson: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "properties", label: "properties", kind: "stringList" },
  { id: "rulesJson", label: "rulesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.records(i.rulesJson).map((v) => {
    const name = H.str(v.name).toUpperCase();
    H.icalName(name);
    const minimum = H.int(H.num(v.minimum), 0, 128),
      maximum = H.int(H.num(v.maximum), minimum, 128);
    return { name, minimum, maximum };
  });
  i.properties.forEach(H.icalName);
  return H.finish({
    violations: r.flatMap((v) => {
      const count = i.properties.filter(
        (x) => x.toUpperCase() === v.name,
      ).length;
      return count < v.minimum || count > v.maximum ? [{ ...v, count }] : [];
    }),
  });
};
export const example = {
  input: {
    properties: ["UID", "SUMMARY", "UID"],
    rulesJson: '[{"name":"UID","minimum":1,"maximum":1}]',
  },
  output: {
    result: { violations: [{ name: "UID", minimum: 1, maximum: 1, count: 2 }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["iCalendar Property Cardinality Audit", "iCalendar", "calendars"],
    collections: ["encode-decode"],
    fields: ["ical", "iCalendar", "calendars"],
    keywords: ["iCalendar", "calendars"],
  },
  id: "ical/property-cardinality-audit",
  title: "iCalendar Property Cardinality Audit",
  description:
    "Audit property-name occurrence cardinality only against explicitly supplied component rules; no embedded current iCalendar rule table or complete validity claim.",
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
          violations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                minimum: { type: "number" },
                maximum: { type: "number" },
                count: { type: "number" },
              },
              required: ["name", "minimum", "maximum", "count"],
            },
          },
        },
        required: ["violations"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
