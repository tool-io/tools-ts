import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ gpsDayOfWeek: number; secondsOfDay: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "gpsDayOfWeek", label: "Gps day of week", kind: "integer" },
  { id: "secondsOfDay", label: "Seconds of day", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.gpsDayOfWeek, 0, 6);
  H.check(i.secondsOfDay >= 0 && i.secondsOfDay < 86400);
  return H.finish({ secondsOfWeek: i.gpsDayOfWeek * 86400 + i.secondsOfDay });
};
export const example = {
  input: { gpsDayOfWeek: 2, secondsOfDay: 3600 },
  output: { result: { secondsOfWeek: 176400 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Seconds of Week from Day of Week Converter", "surveying"],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/seconds-of-week-day-converter",
  title: "Seconds of Week from Day of Week Converter",
  description:
    "Convert zero-based GPS day-of-week (Sunday=0) plus seconds in a uniform 86400-second GPS day to seconds-of-week; UTC leap-second days are not interpreted.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { secondsOfWeek: { type: "number" } },
        required: ["secondsOfWeek"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
