import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  gregorianDate: string;
  secondsSinceMidnight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "gregorianDate", label: "Gregorian date", kind: "string" },
  {
    id: "secondsSinceMidnight",
    label: "Seconds since midnight",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    julianDay: H.julianDay(i.gregorianDate, i.secondsSinceMidnight),
  });
};
export const example = {
  input: { gregorianDate: "2000-01-01", secondsSinceMidnight: 43200 },
  output: { result: { julianDay: 2451545 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/julian-date-calendar-standard-converter",
  title: "Julian Date from Calendar Date Standard Converter",
  description:
    "Convert proleptic Gregorian civil date plus same-scale uniform-day seconds to fractional Julian date (noon origin); time scale is caller-defined, no UTC leap-second instant or calendar-cutover inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
