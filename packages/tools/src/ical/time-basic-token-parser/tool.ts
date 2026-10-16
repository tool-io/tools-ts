import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "token", label: "token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish(H.timeBasic(i.token));
};
export const example = {
  input: { token: "235960Z" },
  output: { result: { hour: 23, minute: 59, second: 60, utc: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["iCalendar Basic Time Token Parser", "iCalendar", "calendars"],
    collections: ["encode-decode"],
    fields: ["ical", "iCalendar", "calendars"],
    keywords: ["iCalendar", "calendars"],
  },
  id: "ical/time-basic-token-parser",
  title: "iCalendar Basic Time Token Parser",
  description:
    "Parse strict iCalendar basic time with optional UTC marker and allowed second 60; does not validate leap-second scheduling or resolve time zones.",
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
          hour: { type: "number" },
          minute: { type: "number" },
          second: { type: "number" },
          utc: { type: "boolean" },
        },
        required: ["hour", "minute", "second", "utc"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
