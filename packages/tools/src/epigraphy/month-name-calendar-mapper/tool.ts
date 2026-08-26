import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MonthNameCalendarMapperInput = {
  readonly monthName: string;
};

export type MonthNameCalendarMapperOutput = {
  readonly monthNumber: number;
  readonly modernMonthName: string;
};

const MONTH_TABLE: ReadonlyArray<readonly [string, number, string]> = [
  ["septem", 9, "September"],
  ["sept", 9, "September"],
  ["octob", 10, "October"],
  ["oct", 10, "October"],
  ["novem", 11, "November"],
  ["nov", 11, "November"],
  ["decem", 12, "December"],
  ["dec", 12, "December"],
  ["augu", 8, "August"],
  ["aug", 8, "August"],
  ["sextil", 8, "August"],
  ["quinctil", 7, "July"],
  ["febr", 2, "February"],
  ["ianu", 1, "January"],
  ["janu", 1, "January"],
  ["mart", 3, "March"],
  ["apri", 4, "April"],
  ["maiu", 5, "May"],
  ["mai", 5, "May"],
  ["iuni", 6, "June"],
  ["iun", 6, "June"],
  ["juni", 6, "June"],
  ["jun", 6, "June"],
  ["iuli", 7, "July"],
  ["iul", 7, "July"],
  ["juli", 7, "July"],
  ["jul", 7, "July"],
];

export const calculateMonthNameCalendarMapper = (
  input: MonthNameCalendarMapperInput,
): MonthNameCalendarMapperOutput => {
  const normalized = input.monthName.trim().replace(/\.+$/, "").toLowerCase();
  if (!normalized)
    simpleError(
      "monthName",
      "Month name must contain characters.",
      "empty_month_name",
    );
  for (const [prefix, monthNumber, modernMonthName] of MONTH_TABLE)
    if (normalized.startsWith(prefix)) return { monthNumber, modernMonthName };
  return simpleError(
    "monthName",
    `"${input.monthName}" is not a recognized Latin month name.`,
    "unknown_month",
  );
};

export const monthNameCalendarMapperExample = {
  input: { monthName: "September" },
  output: { monthNumber: 9, modernMonthName: "September" },
} satisfies ToolExample<
  MonthNameCalendarMapperInput,
  MonthNameCalendarMapperOutput
>;

export const monthNameCalendarMapperTool = createSimpleTool({
  id: "epigraphy/month-name-calendar-mapper",
  title: "Month Name Roman Calendar Token Mapper",
  description:
    "Maps Latin month names, including archaic Quintilis and Sextilis, to their Gregorian month numbers.",
  inputs: [
    {
      id: "monthName",
      kind: "string",
      label: "Month name",
      description: "Latin or Latinized month name, any case.",
    },
  ],
  outputs: [
    {
      id: "monthNumber",
      kind: "integer",
      label: "Month number",
      description: "Month number from one to twelve.",
    },
    {
      id: "modernMonthName",
      kind: "string",
      label: "Modern name",
      description: "Modern English month name.",
    },
  ],
  calculate: (input) =>
    calculateMonthNameCalendarMapper(
      input as unknown as MonthNameCalendarMapperInput,
    ),
});

export const runMonthNameCalendarMapper = monthNameCalendarMapperTool.execute;
export default monthNameCalendarMapperTool;
