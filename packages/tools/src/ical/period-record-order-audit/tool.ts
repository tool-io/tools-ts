import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ periodsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "periodsJson", label: "periodsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.records(i.periodsJson).map((v) => ({
    start: H.num(v.start),
    end: H.num(v.end),
  }));
  return H.finish({
    periods: r.map((v, index) => ({
      ...v,
      index,
      ordered: v.end > v.start,
      duration: v.end - v.start,
    })),
  });
};
export const example = {
  input: { periodsJson: '[{"start":4,"end":2}]' },
  output: {
    result: {
      periods: [{ start: 4, end: 2, index: 0, ordered: false, duration: -2 }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["iCalendar Period Record Order Audit", "iCalendar", "calendars"],
    collections: ["encode-decode"],
    fields: ["ical", "iCalendar", "calendars"],
    keywords: ["iCalendar", "calendars"],
  },
  id: "ical/period-record-order-audit",
  title: "iCalendar Period Record Order Audit",
  description:
    "Audit strict-positive period order on already resolved same-scale numeric endpoint observations, retaining signed duration; does not parse iCalendar timestamps or resolve zones.",
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
          periods: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                start: { type: "number" },
                end: { type: "number" },
                index: { type: "number" },
                ordered: { type: "boolean" },
                duration: { type: "number" },
              },
              required: ["start", "end", "index", "ordered", "duration"],
            },
          },
        },
        required: ["periods"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
