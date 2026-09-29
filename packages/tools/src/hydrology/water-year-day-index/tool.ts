import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  date: string;
  startMonth: number;
  startDay: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "date", label: "Date", kind: "string" },
  { id: "startMonth", label: "Start month", kind: "integer" },
  { id: "startDay", label: "Start day", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const d = H.civil(i.date);
  H.int(i.startMonth, 1, 12);
  H.int(i.startDay, 1, 31);
  const md =
    String(i.startMonth).padStart(2, "0") +
    "-" +
    String(i.startDay).padStart(2, "0");
  H.civil("2023-" + md);
  const year = d.getUTCFullYear() - (i.date.slice(5) < md ? 1 : 0),
    start = String(year).padStart(4, "0") + "-" + md;
  H.int(year, 1, 9999);
  return H.finish({
    waterYearStart: start,
    dayIndex:
      Math.round((d.getTime() - H.civil(start).getTime()) / 86400000) + 1,
  });
};
export const example = {
  input: { date: "2024-01-01", startMonth: 10, startDay: 1 },
  output: { result: { waterYearStart: "2023-10-01", dayIndex: 93 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "hydrology/water-year-day-index",
  title: "Hydrology: Water Year Day Index Tool",
  description:
    "Compute a one-based hydrologic-year day from an explicit annually valid month/day start; excludes February29 annual starts and jurisdiction defaults.",
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
          dayIndex: { type: "number" },
          waterYearStart: { type: "string" },
        },
        required: ["dayIndex", "waterYearStart"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
