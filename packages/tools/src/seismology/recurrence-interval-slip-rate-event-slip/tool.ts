import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const recurrenceIntervalSlipRateEventSlipExample = {
  input: { eventSlipM: 4, slipRateMmYr: 20 },
  output: {
    recurrenceYears: 200,
    note: "Assumes full seismic closure; aseismic creep lengthens the true interval.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const recurrenceIntervalSlipRateEventSlipTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ eventSlipM, slipRateMmYr }) => {
      if (eventSlipM <= 0)
        simpleError("eventSlipM", "Event slip must be positive.");
      if (slipRateMmYr <= 0)
        simpleError("slipRateMmYr", "Rate must be positive.");
      const recurrenceYears = eventSlipM / (slipRateMmYr * 1e-3);
      return {
        recurrenceYears,
        note: "Assumes full seismic closure; aseismic creep lengthens the true interval.",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Characteristic recurrence from per-event slip and long-term slip rate: T = D/V.",
  id: "seismology/recurrence-interval-slip-rate-event-slip",
  inputs: [
    {
      minimum: 0,
      description: "Slip per event.",
      id: "eventSlipM",
      kind: "number",
      label: "D",
      unit: "m",
    },
    {
      minimum: 0,
      description: "Long-term slip rate.",
      id: "slipRateMmYr",
      kind: "number",
      label: "V",
      unit: "mm/yr",
    },
  ],
  outputs: [
    {
      description: "Recurrence interval.",
      id: "recurrenceYears",
      kind: "number",
      label: "T",
      unit: "yr",
    },
    {
      description: "Closure caveat.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Recurrence Interval Slip Rate Event Slip Calculator",
});
export const runRecurrenceIntervalSlipRateEventSlip =
  recurrenceIntervalSlipRateEventSlipTool.execute;
export { recurrenceIntervalSlipRateEventSlipExample as example };
export default recurrenceIntervalSlipRateEventSlipTool;
