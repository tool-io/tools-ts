import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ZodiacSignInput = {
  readonly day: number;
  readonly month: number;
};

export type ZodiacSignOutput = {
  readonly sign: string;
};

export const zodiacSignExample = {
  input: { day: 21, month: 3 },
  output: { sign: "Aries" },
} satisfies ToolExample<ZodiacSignInput, ZodiacSignOutput>;

const MAX_DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const SIGN_STARTS: readonly (readonly [number, number, string])[] = [
  [1, 20, "Aquarius"],
  [2, 19, "Pisces"],
  [3, 21, "Aries"],
  [4, 20, "Taurus"],
  [5, 21, "Gemini"],
  [6, 21, "Cancer"],
  [7, 23, "Leo"],
  [8, 23, "Virgo"],
  [9, 23, "Libra"],
  [10, 23, "Scorpio"],
  [11, 22, "Sagittarius"],
  [12, 22, "Capricorn"],
];

const zodiacSignFor = (month: number, day: number): string => {
  let sign = "Capricorn";
  for (const [startMonth, startDay, name] of SIGN_STARTS)
    if (month > startMonth || (month === startMonth && day >= startDay))
      sign = name;
  return sign;
};

export const zodiacSignTool = createSimpleTool({
  id: "date/zodiac-sign",
  title: "Zodiac Sign Calculator",
  description:
    "Return the western zodiac sign for a calendar month and day using standard date ranges.",
  inputs: [
    { id: "month", label: "Month", kind: "integer", maximum: 12, minimum: 1 },
    { id: "day", label: "Day", kind: "integer", maximum: 31, minimum: 1 },
  ],
  outputs: [{ id: "sign", label: "Zodiac sign", kind: "string" }],
  calculate: (input) => {
    const month = input.month as number;
    const day = input.day as number;
    if (day > MAX_DAYS_IN_MONTH[month - 1])
      simpleError("day", "Day does not exist in this month.", "invalid_day");
    return { sign: zodiacSignFor(month, day) };
  },
});
export const runZodiacSign = zodiacSignTool.execute;
export default zodiacSignTool;
