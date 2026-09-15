import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{ year: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "year", label: "Year", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.year, "year", 1583, 4099);
  const a = i.year % 19,
    b = Math.floor(i.year / 100),
    c = i.year % 100,
    d = Math.floor(b / 4),
    e = b % 4,
    f = Math.floor((b + 8) / 25),
    g = Math.floor((b - f + 1) / 3),
    h = (19 * a + b - d - g + 15) % 30,
    j = Math.floor(c / 4),
    k = c % 4,
    l = (32 + 2 * e + 2 * j - h - k) % 7,
    m = Math.floor((a + 11 * h + 22 * l) / 451),
    z = h + l - 7 * m + 114,
    month = Math.floor(z / 31),
    day = (z % 31) + 1;
  return {
    year: i.year,
    month,
    day,
    gregorianDate:
      String(i.year) +
      "-" +
      String(month).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0"),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { year: 2026 },
  output: {
    result: { year: 2026, month: 4, day: 5, gregorianDate: "2026-04-05" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/western-easter-gauss-date-calculator",
  title: "Western Easter Gauss Date Calculator",
  description:
    "Calculate Gregorian Western Easter by the corrected Gregorian computus (Meeus/Jones/Butcher arithmetic); not Orthodox Easter or a Julian-calendar conversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
