import { createSimpleTool } from "../../core/simple.js";
export const minutesToHoursMinutesTool = createSimpleTool({
  id: "convert/minutes-to-hours-minutes",
  title: "Minutes to Hours and Minutes Converter",
  description:
    "Split a signed minute duration into whole hours and remaining minutes.",
  inputs: [
    {
      id: "totalMinutes",
      label: "Total minutes",
      kind: "number",
      format: "duration",
      unit: "min",
    },
  ],
  outputs: [
    { id: "hours", label: "Hours", kind: "integer" },
    { id: "minutes", label: "Minutes", kind: "number" },
  ],
  calculate: (input) => {
    const total = input.totalMinutes as number,
      hours = Math.trunc(total / 60);
    return { hours, minutes: total - hours * 60 };
  },
});
export const runMinutesToHoursMinutes = minutesToHoursMinutesTool.execute;
export default minutesToHoursMinutesTool;
