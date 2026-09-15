import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  equationOfTime,
} from "../batch52-shared.js";
export type Input = Readonly<{ readonly dayOfYear: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "dayOfYear", label: "Day of year", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.dayOfYear, "day", 1, 366);
  return { approximateMinutes: equationOfTime(i.dayOfYear) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { dayOfYear: 81 },
  output: { result: { approximateMinutes: -7.53 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/equation-of-time-day-approximation-calculator",
  title: "Equation of Time Minutes Value Day-of-Year Approximation Calculator",
  description:
    "Explicit trigonometric EOT approximation B=2pi(day-81)/364, minutes apparent-minus-mean solar time; not precision ephemeris.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
