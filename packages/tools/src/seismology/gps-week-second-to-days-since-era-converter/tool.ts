import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const gpsWeekSecondToDaysSinceEraConverterExample = {
  input: { gpsWeek: 2300, rolloversSince1999: 0 },
  output: (() => ({
    absoluteWeek: 1023 + (((2300 % 1024) - 1023 + 2048) % 1024),
    daysSinceEraStart: (1023 + (((2300 % 1024) - 1023 + 2048) % 1024)) * 7,
  }))(),
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const gpsWeekSecondToDaysSinceEraConverterTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ gpsWeek, rolloversSince1999 }) => {
      const wk = gpsWeek % 1024;
      // Broadcast week is modulo 1024; anchor to the 1999 rollover at absolute week 1023.
      const roll = rolloversSince1999 ?? 0;
      const absoluteWeek = 1023 + roll * 1024 + ((wk - 1023 + 2048) % 1024);
      return { absoluteWeek, daysSinceEraStart: absoluteWeek * 7 };
    })(input as never) as Record<string, unknown>,
  description:
    "Convert GPS week/seconds-of-week to days since the GPS era start (1980-01-06) with rollover count.",
  id: "seismology/gps-week-second-to-days-since-era-converter",
  inputs: [
    {
      description: "GPS week number (mod-1024 as broadcast).",
      id: "gpsWeek",
      kind: "integer",
      label: "week",
    },
    {
      default: 0,
      minimum: 0,
      description: "Rollovers since the 1999 epoch.",
      id: "rolloversSince1999",
      kind: "integer",
      label: "roll",
    },
  ],
  outputs: [
    {
      description: "Absolute week since GPS era.",
      id: "absoluteWeek",
      kind: "integer",
      label: "W_abs",
    },
    {
      description: "Days since 1980-01-06.",
      id: "daysSinceEraStart",
      kind: "integer",
      label: "days",
    },
  ],
  title: "GPS Week Second To Days Since Era Converter",
});
export const runGpsWeekSecondToDaysSinceEraConverter =
  gpsWeekSecondToDaysSinceEraConverterTool.execute;
export { gpsWeekSecondToDaysSinceEraConverterExample as example };
export default gpsWeekSecondToDaysSinceEraConverterTool;
