import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";
import { calculateJdnToDate } from "../../date/julian-day-number-to-date/tool.js";
export type Input = Readonly<{
  readonly julianYear: number;
  readonly julianMonth: number;
  readonly julianDay: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "julianYear", label: "Julian year", kind: "number" },
  { id: "julianMonth", label: "Julian month", kind: "number" },
  { id: "julianDay", label: "Julian day", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.julianYear, "year", 1, 9998);
  bounded(input.julianMonth, "month", 1, 12);
  const lengths = [
    31,
    input.julianYear % 4 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  bounded(input.julianDay, "day", 1, lengths[input.julianMonth - 1]);
  const a = Math.floor((14 - input.julianMonth) / 12),
    y = input.julianYear + 4800 - a,
    m = input.julianMonth + 12 * a - 3,
    jdn =
      input.julianDay +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      32083;
  const date = calculateJdnToDate({ jdn }).date,
    [gy, gm] = date.split("-").map(Number),
    adjusted = gy - (gm <= 2 ? 1 : 0);
  return {
    prolepticGregorianDate: date,
    gregorianMinusJulianNominalDays:
      Math.floor(adjusted / 100) - Math.floor(adjusted / 400) - 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { julianYear: 1900, julianMonth: 2, julianDay: 29 },
  output: {
    result: {
      prolepticGregorianDate: "1900-03-13",
      gregorianMinusJulianNominalDays: 13,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/julian-gregorian-old-style-offset-converter",
  title: "Julian Gregorian Old Style Offset Converter",
  description:
    "Proleptic Julian civil date to proleptic Gregorian using existing JDN decoder. Positive years1–9998, no jurisdictional adoption, old-style year-start or era inference. Offset is the conventional calendar-rule difference evaluated at the resulting Gregorian date, not subtraction of potentially invalid Gregorian labels for Julian leap days.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
