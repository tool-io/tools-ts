import { createSimpleTool } from "../../core/simple.js";
import {
  formatPlainDate,
  millisecondsPerDay,
  parsePlainDate,
} from "../../core/date.js";
export const addDaysTool = createSimpleTool({
  id: "date/add-days",
  title: "Date Add Days Calculator",
  description: "Add a signed whole-day offset to an ISO calendar date.",
  inputs: [
    { id: "date", label: "Date", kind: "string", format: "date" },
    { id: "days", label: "Days", kind: "integer" },
  ],
  outputs: [
    { id: "date", label: "Result date", kind: "string", format: "date" },
  ],
  calculate: (input) => {
    return {
      date: formatPlainDate(
        parsePlainDate(input.date as string) +
          (input.days as number) * millisecondsPerDay,
      ),
    };
  },
});
export const runAddDays = addDaysTool.execute;
export default addDaysTool;
