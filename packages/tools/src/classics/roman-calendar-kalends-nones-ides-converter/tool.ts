import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";

export type Input = Readonly<{ readonly month: number; readonly day: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "month", label: "Month", kind: "number" },
  { id: "day", label: "Day", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.month, "month", 1, 12);
  const length = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    input.month - 1
  ];
  bounded(input.day, "day", 1, length);
  const long = [3, 5, 7, 10].includes(input.month),
    nones = long ? 7 : 5,
    ides = long ? 15 : 13;
  let ref: string,
    dist: number,
    m = input.month;
  if (input.day === 1) {
    ref = "Kalendae";
    dist = 1;
  } else if (input.day <= nones) {
    ref = "Nonae";
    dist = nones - input.day + 1;
  } else if (input.day <= ides) {
    ref = "Idus";
    dist = ides - input.day + 1;
  } else {
    ref = "Kalendae";
    dist = length - input.day + 2;
    m = (input.month % 12) + 1;
  }
  return {
    romanReference:
      dist === 1
        ? ref
        : dist === 2
          ? "pridie " + ref
          : "ante diem " + dist + " " + ref,
    referenceMonth: m,
    inclusiveDaysToReference: dist,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { month: 3, day: 14 },
  output: {
    result: {
      romanReference: "pridie Idus",
      referenceMonth: 3,
      inclusiveDaysToReference: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/roman-calendar-kalends-nones-ides-converter",
  title: "Roman Calendar Kalends/Nones/Ides Converter",
  description:
    "Ideal common-year twelve-month Roman inclusive Kalends/Nones/Ides label with numeric ante-diem count. Excludes leap bissextile repetition, pre-Julian intercalation and historical calendar reconstruction; month is numeric, not declined Latin.",
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
