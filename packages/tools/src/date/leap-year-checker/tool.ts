import { createSimpleTool } from "../../core/simple.js";
export const leapYearCheckerTool = createSimpleTool({
  id: "date/leap-year-checker",
  title: "Leap Year Checker",
  description: "Check whether a Gregorian calendar year is a leap year.",
  inputs: [{ id: "year", label: "Year", kind: "integer" }],
  outputs: [{ id: "leapYear", label: "Leap year", kind: "boolean" }],
  calculate: (input) => {
    const year = input.year as number;
    return {
      leapYear: year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0),
    };
  },
});
export const runLeapYearChecker = leapYearCheckerTool.execute;
export default leapYearCheckerTool;
