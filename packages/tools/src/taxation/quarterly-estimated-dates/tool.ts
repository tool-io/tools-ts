import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly taxYear: number;
  readonly nonBusinessDates: readonly string[];
}>;
export type Output = Readonly<{
  readonly adjustedDueDates: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  const nominal = [
    `${input.taxYear}-04-15`,
    `${input.taxYear}-06-15`,
    `${input.taxYear}-09-15`,
    `${input.taxYear + 1}-01-15`,
  ];
  const excluded = new Set(input.nonBusinessDates);
  const adjustedDueDates = nominal.map((value) => {
    let time = Date.parse(`${value}T00:00:00Z`);
    while (true) {
      const date = new Date(time);
      const iso = date.toISOString().slice(0, 10);
      const day = date.getUTCDay();
      if (day !== 0 && day !== 6 && !excluded.has(iso)) return iso;
      time += 86400000;
    }
  });
  return { adjustedDueDates };
};

export const exampleInput = {
  taxYear: 2025,
  nonBusinessDates: [],
} satisfies Input;
export const exampleOutput = {
  adjustedDueDates: ["2025-04-15", "2025-06-16", "2025-09-15", "2026-01-15"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      taxYear: input.taxYear as number,
      nonBusinessDates: input.nonBusinessDates as readonly string[],
    }),
  description:
    "Generate quarterly estimated-tax dates and move them past weekends and supplied holidays.",
  id: "taxation/quarterly-estimated-dates",
  inputs: [
    {
      id: "taxYear",
      label: "Tax year",
      kind: "integer",
      minimum: 1900,
      maximum: 9998,
    },
    {
      id: "nonBusinessDates",
      label: "Additional nonbusiness dates",
      kind: "stringList",
    },
  ],
  outputs: [
    {
      id: "adjustedDueDates",
      label: "Adjusted quarterly due dates",
      kind: "stringList",
    },
  ],
  title: "Quarterly Estimated Dates",
});

export const run = tool.execute;
export default tool;
