import { createSimpleTool } from "../../core/simple.js";
import { millisecondsPerDay, parsePlainDate } from "../../core/date.js";
export const differenceTool = createSimpleTool({
  id: "date/difference",
  title: "Date Difference Calculator",
  description:
    "Calculate the signed number of calendar days between two ISO dates.",
  inputs: [
    { id: "startDate", label: "Start date", kind: "string", format: "date" },
    { id: "endDate", label: "End date", kind: "string", format: "date" },
  ],
  outputs: [
    {
      id: "days",
      label: "Day difference",
      kind: "integer",
      format: "duration",
      unit: "d",
    },
  ],
  calculate: (input) => {
    return {
      days:
        (parsePlainDate(input.endDate as string, "endDate") -
          parsePlainDate(input.startDate as string, "startDate")) /
        millisecondsPerDay,
    };
  },
});
export const runDifference = differenceTool.execute;
export default differenceTool;
