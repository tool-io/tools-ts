import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const daysInMonth = (year: number, month: number): number =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();
export const example = {
  input: { year: 2024, currentWeekDate: "2024-01-03" },
  output: {
    months: {
      year: 2024,
      months: [
        {
          month: 1,
          weeks: [
            { dates: [1, 2, 3, 4, 5, 6, 7], highlighted: true },
            { dates: [8, 9, 10, 11, 12, 13, 14], highlighted: false },
            { dates: [15, 16, 17, 18, 19, 20, 21], highlighted: false },
            { dates: [22, 23, 24, 25, 26, 27, 28], highlighted: false },
            { dates: [29, 30, 31, null, null, null, null], highlighted: false },
          ],
        },
        {
          month: 2,
          weeks: [
            { dates: [null, null, null, 1, 2, 3, 4], highlighted: false },
            { dates: [5, 6, 7, 8, 9, 10, 11], highlighted: false },
            { dates: [12, 13, 14, 15, 16, 17, 18], highlighted: false },
            { dates: [19, 20, 21, 22, 23, 24, 25], highlighted: false },
            { dates: [26, 27, 28, 29, null, null, null], highlighted: false },
          ],
        },
        {
          month: 3,
          weeks: [
            { dates: [null, null, null, null, 1, 2, 3], highlighted: false },
            { dates: [4, 5, 6, 7, 8, 9, 10], highlighted: false },
            { dates: [11, 12, 13, 14, 15, 16, 17], highlighted: false },
            { dates: [18, 19, 20, 21, 22, 23, 24], highlighted: false },
            { dates: [25, 26, 27, 28, 29, 30, 31], highlighted: false },
          ],
        },
        {
          month: 4,
          weeks: [
            { dates: [1, 2, 3, 4, 5, 6, 7], highlighted: false },
            { dates: [8, 9, 10, 11, 12, 13, 14], highlighted: false },
            { dates: [15, 16, 17, 18, 19, 20, 21], highlighted: false },
            { dates: [22, 23, 24, 25, 26, 27, 28], highlighted: false },
            {
              dates: [29, 30, null, null, null, null, null],
              highlighted: false,
            },
          ],
        },
        {
          month: 5,
          weeks: [
            { dates: [null, null, 1, 2, 3, 4, 5], highlighted: false },
            { dates: [6, 7, 8, 9, 10, 11, 12], highlighted: false },
            { dates: [13, 14, 15, 16, 17, 18, 19], highlighted: false },
            { dates: [20, 21, 22, 23, 24, 25, 26], highlighted: false },
            { dates: [27, 28, 29, 30, 31, null, null], highlighted: false },
          ],
        },
        {
          month: 6,
          weeks: [
            { dates: [null, null, null, null, null, 1, 2], highlighted: false },
            { dates: [3, 4, 5, 6, 7, 8, 9], highlighted: false },
            { dates: [10, 11, 12, 13, 14, 15, 16], highlighted: false },
            { dates: [17, 18, 19, 20, 21, 22, 23], highlighted: false },
            { dates: [24, 25, 26, 27, 28, 29, 30], highlighted: false },
          ],
        },
        {
          month: 7,
          weeks: [
            { dates: [1, 2, 3, 4, 5, 6, 7], highlighted: false },
            { dates: [8, 9, 10, 11, 12, 13, 14], highlighted: false },
            { dates: [15, 16, 17, 18, 19, 20, 21], highlighted: false },
            { dates: [22, 23, 24, 25, 26, 27, 28], highlighted: false },
            { dates: [29, 30, 31, null, null, null, null], highlighted: false },
          ],
        },
        {
          month: 8,
          weeks: [
            { dates: [null, null, null, 1, 2, 3, 4], highlighted: false },
            { dates: [5, 6, 7, 8, 9, 10, 11], highlighted: false },
            { dates: [12, 13, 14, 15, 16, 17, 18], highlighted: false },
            { dates: [19, 20, 21, 22, 23, 24, 25], highlighted: false },
            { dates: [26, 27, 28, 29, 30, 31, null], highlighted: false },
          ],
        },
        {
          month: 9,
          weeks: [
            {
              dates: [null, null, null, null, null, null, 1],
              highlighted: false,
            },
            { dates: [2, 3, 4, 5, 6, 7, 8], highlighted: false },
            { dates: [9, 10, 11, 12, 13, 14, 15], highlighted: false },
            { dates: [16, 17, 18, 19, 20, 21, 22], highlighted: false },
            { dates: [23, 24, 25, 26, 27, 28, 29], highlighted: false },
            {
              dates: [30, null, null, null, null, null, null],
              highlighted: false,
            },
          ],
        },
        {
          month: 10,
          weeks: [
            { dates: [null, 1, 2, 3, 4, 5, 6], highlighted: false },
            { dates: [7, 8, 9, 10, 11, 12, 13], highlighted: false },
            { dates: [14, 15, 16, 17, 18, 19, 20], highlighted: false },
            { dates: [21, 22, 23, 24, 25, 26, 27], highlighted: false },
            { dates: [28, 29, 30, 31, null, null, null], highlighted: false },
          ],
        },
        {
          month: 11,
          weeks: [
            { dates: [null, null, null, null, 1, 2, 3], highlighted: false },
            { dates: [4, 5, 6, 7, 8, 9, 10], highlighted: false },
            { dates: [11, 12, 13, 14, 15, 16, 17], highlighted: false },
            { dates: [18, 19, 20, 21, 22, 23, 24], highlighted: false },
            { dates: [25, 26, 27, 28, 29, 30, null], highlighted: false },
          ],
        },
        {
          month: 12,
          weeks: [
            {
              dates: [null, null, null, null, null, null, 1],
              highlighted: false,
            },
            { dates: [2, 3, 4, 5, 6, 7, 8], highlighted: false },
            { dates: [9, 10, 11, 12, 13, 14, 15], highlighted: false },
            { dates: [16, 17, 18, 19, 20, 21, 22], highlighted: false },
            { dates: [23, 24, 25, 26, 27, 28, 29], highlighted: false },
            {
              dates: [30, 31, null, null, null, null, null],
              highlighted: false,
            },
          ],
        },
      ],
    },
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "date/year-calendar",
  title: "Year Calendar",
  description:
    "Generate a Monday-first calendar for all 12 months and mark the ISO week containing an optional date. Dates are interpreted in UTC to avoid local time-zone shifts.",
  inputs: [
    { id: "year", kind: "integer", label: "Year", minimum: 100, maximum: 9999 },
    {
      id: "currentWeekDate",
      kind: "string",
      label: "Week highlight date",
      default: "",
    },
  ],
  outputs: [{ id: "months", kind: "object", label: "Month calendar data" }],
  calculate: (input) => {
    const year = input.year as number;
    const target = input.currentWeekDate as string;
    let targetTime: number | null = null;
    if (target) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(target))
        simpleError("currentWeekDate", "Use YYYY-MM-DD.");
      targetTime = Date.parse(target + "T00:00:00Z");
      if (
        !Number.isFinite(targetTime) ||
        new Date(targetTime).toISOString().slice(0, 10) !== target
      )
        simpleError("currentWeekDate", "Enter a valid calendar date.");
    }
    const months = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const firstDay = (new Date(Date.UTC(year, i, 1)).getUTCDay() + 6) % 7;
      const days = daysInMonth(year, month);
      const weeks = Array.from(
        { length: Math.ceil((firstDay + days) / 7) },
        (_, w) => {
          const dates = Array.from({ length: 7 }, (_, d) => {
            const day = w * 7 + d - firstDay + 1;
            return day >= 1 && day <= days ? day : null;
          });
          const weekStart = Date.UTC(year, i, 1 - firstDay + w * 7);
          const targetWeekStart =
            targetTime === null
              ? null
              : targetTime -
                ((new Date(targetTime).getUTCDay() + 6) % 7) * 86400000;
          const highlighted = weekStart === targetWeekStart;
          return { dates, highlighted };
        },
      );
      return { month, weeks };
    });
    return { months: { year, months } };
  },
});
export type YearCalendarInput = Readonly<typeof example.input>;
export type YearCalendarOutput = Readonly<typeof example.output>;
export const yearCalendarTool = tool;
export const runYearCalendar = tool.execute;
export default tool;
