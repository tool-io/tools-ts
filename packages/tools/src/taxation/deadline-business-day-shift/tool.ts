import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nominalDate: string;
  readonly nonBusinessDates: readonly string[];
}>;
export type Output = Readonly<{
  readonly adjustedDate: string;
  readonly daysShifted: number;
}>;

export const calculate = (input: Input): Output => {
  const parse = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    return Date.parse(`${value}T00:00:00Z`);
  };
  let time = parse(input.nominalDate);
  if (
    Number.isNaN(time) ||
    input.nonBusinessDates.some((value) => Number.isNaN(parse(value)))
  )
    simpleError(
      "nominalDate",
      "Dates must use valid YYYY-MM-DD format.",
      "invalid_date",
    );
  const excluded = new Set(input.nonBusinessDates);
  let daysShifted = 0;
  while (true) {
    const date = new Date(time);
    const iso = date.toISOString().slice(0, 10);
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6 && !excluded.has(iso))
      return { adjustedDate: iso, daysShifted };
    time += 86400000;
    daysShifted += 1;
  }
};

export const exampleInput = {
  nominalDate: "2025-04-19",
  nonBusinessDates: ["2025-04-21"],
} satisfies Input;
export const exampleOutput = {
  adjustedDate: "2025-04-22",
  daysShifted: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      nominalDate: input.nominalDate as string,
      nonBusinessDates: input.nonBusinessDates as readonly string[],
    }),
  description:
    "Move a nominal deadline forward past weekends and caller-supplied nonbusiness dates.",
  id: "taxation/deadline-business-day-shift",
  inputs: [
    { id: "nominalDate", label: "Nominal deadline", kind: "string" },
    {
      id: "nonBusinessDates",
      label: "Additional nonbusiness dates",
      kind: "stringList",
    },
  ],
  outputs: [
    { id: "adjustedDate", label: "Adjusted deadline", kind: "string" },
    { id: "daysShifted", label: "Days shifted", kind: "integer", minimum: 0 },
  ],
  title: "Deadline Business-Day Shift",
});

export const run = tool.execute;
export default tool;
