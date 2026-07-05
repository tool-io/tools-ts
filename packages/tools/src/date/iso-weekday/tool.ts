import { createSimpleTool } from "../../core/simple.js";
import { parsePlainDate } from "../../core/date.js";
export const isoWeekdayTool = createSimpleTool({
  id: "date/iso-weekday",
  title: "ISO Weekday Calculator",
  description:
    "Return ISO weekday number and English name for an ISO calendar date.",
  inputs: [{ id: "date", label: "Date", kind: "string", format: "date" }],
  outputs: [
    { id: "weekday", label: "ISO weekday", kind: "integer" },
    { id: "name", label: "Weekday name", kind: "string" },
  ],
  calculate: (input) => {
    const js = new Date(parsePlainDate(input.date as string)).getUTCDay(),
      weekday = js === 0 ? 7 : js;
    return {
      weekday,
      name: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ][weekday - 1]!,
    };
  },
});
export const runIsoWeekday = isoWeekdayTool.execute;
export default isoWeekdayTool;
