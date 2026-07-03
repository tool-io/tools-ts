import { createSimpleTool } from "../../core/simple.js";
import { millisecondsPerDay, parsePlainDate } from "../../core/date.js";
export const dayOfYearTool = createSimpleTool({
  id: "date/day-of-year",
  title: "Day of Year Calculator",
  description: "Calculate the one-based ordinal day of an ISO calendar date.",
  inputs: [{ id: "date", label: "Date", kind: "string", format: "date" }],
  outputs: [{ id: "dayOfYear", label: "Day of year", kind: "integer" }],
  calculate: (input) => {
    const timestamp = parsePlainDate(input.date as string);
    const year = new Date(timestamp).getUTCFullYear();
    return {
      dayOfYear: (timestamp - Date.UTC(year, 0, 1)) / millisecondsPerDay + 1,
    };
  },
});
export const runDayOfYear = dayOfYearTool.execute;
export default dayOfYearTool;
