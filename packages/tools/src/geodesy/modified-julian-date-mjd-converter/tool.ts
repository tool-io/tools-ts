import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ julianDay: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "julianDay", label: "Julian day", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.julianDay >= 1721425.5 && i.julianDay < 5373484.5);
  return H.finish({ modifiedJulianDay: i.julianDay - 2400000.5 });
};
export const example = {
  input: { julianDay: 2451545 },
  output: { result: { modifiedJulianDay: 51544.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Modified Julian Date MJD Converter", "surveying"],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/modified-julian-date-mjd-converter",
  title: "Modified Julian Date MJD Converter",
  description:
    "Convert a same-time-scale Julian date to modified Julian date with the exact epoch offset 2400000.5 days; does not convert UTC, UT1 or TT.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { modifiedJulianDay: { type: "number" } },
        required: ["modifiedJulianDay"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
