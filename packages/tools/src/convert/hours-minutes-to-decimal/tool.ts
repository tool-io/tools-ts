import { createSimpleTool } from "../../core/simple.js";
export const hoursMinutesToDecimalTool = createSimpleTool({
  id: "convert/hours-minutes-to-decimal",
  title: "Hours and Minutes to Decimal Hours Converter",
  description: "Convert signed hours and minutes to decimal hours.",
  inputs: [
    { id: "hours", label: "Hours", kind: "integer" },
    {
      id: "minutes",
      label: "Minutes",
      kind: "number",
      minimum: 0,
      maximum: 59.999999,
    },
  ],
  outputs: [
    {
      id: "decimalHours",
      label: "Decimal hours",
      kind: "number",
      format: "duration",
      unit: "h",
    },
  ],
  calculate: (input) => {
    const hours = input.hours as number,
      fraction = (input.minutes as number) / 60;
    return { decimalHours: hours < 0 ? hours - fraction : hours + fraction };
  },
});
export const runHoursMinutesToDecimal = hoursMinutesToDecimalTool.execute;
export default hoursMinutesToDecimalTool;
