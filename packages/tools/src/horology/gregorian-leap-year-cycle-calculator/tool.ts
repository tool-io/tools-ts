import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GregorianLeapCycleInput = {
  readonly year: number;
};

export type GregorianLeapCycleOutput = {
  readonly centuryException: boolean;
  readonly isLeapYear: boolean;
  readonly leapYearPositionIn400YearCycle: number;
  readonly yearsUntilNextLeapYear: number;
};

const isGregorianLeapYear = (year: number): boolean =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

export const calculateGregorianLeapYearCycle = (
  input: GregorianLeapCycleInput,
): GregorianLeapCycleOutput => {
  if (!Number.isSafeInteger(input.year) || input.year < 1 || input.year > 9999)
    simpleError(
      "year",
      "Year must be an integer from 1 through 9999.",
      "year_out_of_range",
    );
  const isLeapYear = isGregorianLeapYear(input.year);
  const centuryException = input.year % 100 === 0 && input.year % 400 !== 0;
  const leapYearCountThroughYear =
    Math.floor(input.year / 4) -
    Math.floor(input.year / 100) +
    Math.floor(input.year / 400);
  const leapYearPositionIn400YearCycle = isLeapYear
    ? ((leapYearCountThroughYear - 1) % 97) + 1
    : 0;
  let yearsUntilNextLeapYear = isLeapYear ? 0 : 1;
  while (!isGregorianLeapYear(input.year + yearsUntilNextLeapYear))
    yearsUntilNextLeapYear += 1;
  return {
    centuryException,
    isLeapYear,
    leapYearPositionIn400YearCycle,
    yearsUntilNextLeapYear,
  };
};

export const gregorianLeapCycleExample = {
  input: { year: 2100 },
  output: {
    centuryException: true,
    isLeapYear: false,
    leapYearPositionIn400YearCycle: 0,
    yearsUntilNextLeapYear: 4,
  },
} satisfies ToolExample<GregorianLeapCycleInput, GregorianLeapCycleOutput>;

export const gregorianLeapCycleTool = createSimpleTool({
  calculate: (input) =>
    calculateGregorianLeapYearCycle({ year: input.year as number }),
  description:
    "Apply the Gregorian leap-year rule to a year, including century exceptions and the distance to the next leap year.",
  id: "horology/gregorian-leap-year-cycle-calculator",
  inputs: [
    {
      id: "year",
      kind: "integer",
      label: "Gregorian year",
      maximum: 9999,
      minimum: 1,
    },
  ],
  outputs: [
    { id: "centuryException", kind: "boolean", label: "Non-400 century year" },
    { id: "isLeapYear", kind: "boolean", label: "Gregorian leap year" },
    {
      id: "leapYearPositionIn400YearCycle",
      kind: "integer",
      label: "Leap-year position in 400-year cycle",
      maximum: 97,
      minimum: 0,
    },
    {
      id: "yearsUntilNextLeapYear",
      kind: "integer",
      label: "Years until next leap year",
      maximum: 8,
      minimum: 0,
    },
  ],
  title: "Gregorian Leap Year Cycle Calculator",
});

export const runGregorianLeapCycle = gregorianLeapCycleTool.execute;
export default gregorianLeapCycleTool;
