import { createSimpleTool } from "../../core/simple.js";
export const daysInMonthTool = createSimpleTool({
  id: "date/days-in-month",
  title: "Days in Month Calculator",
  description: "Return the number of days in a Gregorian calendar month.",
  inputs: [
    { id: "year", label: "Year", kind: "integer" },
    { id: "month", label: "Month", kind: "integer", minimum: 1, maximum: 12 },
  ],
  outputs: [{ id: "days", label: "Days", kind: "integer" }],
  calculate: (input) => {
    return {
      days: new Date(
        Date.UTC(input.year as number, input.month as number, 0),
      ).getUTCDate(),
    };
  },
});
export const runDaysInMonth = daysInMonthTool.execute;
export default daysInMonthTool;
