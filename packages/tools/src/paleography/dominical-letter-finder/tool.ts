import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DominicalLetterFinderInput = {
  readonly year: number;
  readonly calendar?: "gregorian" | "julian";
};

export type DominicalLetterFinderOutput = {
  readonly dominicalLetter: string;
  readonly januaryFirstWeekday:
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday";
  readonly isLeapYear: boolean;
};

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;
const LETTERS = "ABCDEFG";

const jdnJulian = (y: number, m: number, d: number): number => {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - 32083
  );
};
const jdnGregorian = (y: number, m: number, d: number): number => {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
};

export const calculateDominicalLetterFinder = (
  input: DominicalLetterFinderInput,
): DominicalLetterFinderOutput => {
  if (!(Number.isSafeInteger(input.year) && input.year >= 1))
    return simpleError(
      "year",
      "Year must be a positive integer.",
      "invalid_year",
    );
  const calendar = input.calendar ?? "gregorian";
  const isLeapYear =
    calendar === "julian"
      ? input.year % 4 === 0
      : (input.year % 4 === 0 && input.year % 100 !== 0) ||
        input.year % 400 === 0;
  const jdn =
    calendar === "julian"
      ? jdnJulian(input.year, 1, 1)
      : jdnGregorian(input.year, 1, 1);
  const weekdayIndex = (jdn + 1) % 7;
  const letterIndex = (7 - weekdayIndex) % 7;
  const firstLetter = LETTERS[letterIndex];
  const secondLetter = LETTERS[(letterIndex + 6) % 7];
  return {
    dominicalLetter: isLeapYear ? `${firstLetter}${secondLetter}` : firstLetter,
    januaryFirstWeekday: WEEKDAYS[weekdayIndex],
    isLeapYear,
  };
};

export const dominicalLetterFinderExample = {
  input: { year: 2024, calendar: "gregorian" },
  output: {
    dominicalLetter: "GF",
    januaryFirstWeekday: "monday",
    isLeapYear: true,
  },
} satisfies ToolExample<
  DominicalLetterFinderInput,
  DominicalLetterFinderOutput
>;

export const dominicalLetterFinderTool = createSimpleTool({
  id: "paleography/dominical-letter-finder",
  title: "Dominical Letter Finder",
  description:
    "Find the dominical letter(s) of a year from the weekday of 1 January in the proleptic Julian or Gregorian calendar; leap years carry two consecutive letters with the second taking effect after the February leap day.",
  inputs: [
    {
      description:
        "Calendar year (proleptic before 1582 for the Gregorian option).",
      id: "year",
      kind: "integer",
      label: "Year",
      minimum: 1,
    },
    {
      default: "gregorian",
      description: "Calendar in which the year is reckoned.",
      enum: ["gregorian", "julian"],
      id: "calendar",
      kind: "string",
      label: "Calendar",
    },
  ],
  outputs: [
    {
      description: "Dominical letter, doubled for leap years.",
      id: "dominicalLetter",
      kind: "string",
      label: "Dominical letter",
    },
    {
      description: "Weekday on which 1 January falls.",
      id: "januaryFirstWeekday",
      enum: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      kind: "string",
      label: "1 January weekday",
    },
    {
      description: "Whether the year is leap in the chosen calendar.",
      id: "isLeapYear",
      kind: "boolean",
      label: "Leap year",
    },
  ],
  calculate: (input) =>
    calculateDominicalLetterFinder({
      calendar: input.calendar as DominicalLetterFinderInput["calendar"],
      year: input.year as number,
    }),
});

export const runDominicalLetterFinder = dominicalLetterFinderTool.execute;
export default dominicalLetterFinderTool;
