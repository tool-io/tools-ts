import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DaylightSavingShiftInput = Readonly<{
  readonly clockHour: number;
  readonly shiftHours: number;
}>;
export type DaylightSavingShiftOutput = Readonly<{
  readonly adjustedHour: number;
}>;

export const calculateDaylightSavingShift = (
  x: DaylightSavingShiftInput,
): DaylightSavingShiftOutput => {
  if (!Number.isFinite(x.clockHour) || x.clockHour < 0)
    simpleError("clockHour", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.shiftHours))
    simpleError("shiftHours", "Provide a finite number.");
  if (!(x.clockHour < 24 && Math.abs(x.shiftHours) <= 2))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const adjustedHour = (((x.clockHour + x.shiftHours) % 24) + 24) % 24;
  if (!Number.isFinite(adjustedHour))
    simpleError(
      "adjustedHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { adjustedHour: Object.is(adjustedHour, -0) ? 0 : adjustedHour };
};

export const example = {
  input: {
    clockHour: 12,
    shiftHours: 1,
  },
  output: { adjustedHour: 13 },
} satisfies ToolExample<DaylightSavingShiftInput, DaylightSavingShiftOutput>;

export const tool = createSimpleTool({
  id: "horology/daylight-saving-shift",
  title: "Daylight Saving Shift",
  description:
    "Adjusted 24-hour clock hour after a user-supplied signed daylight-saving shift; does not infer dates or jurisdictions.",
  inputs: [
    { id: "clockHour", kind: "number", label: "Clock Hour", minimum: 0 },
    { id: "shiftHours", kind: "number", label: "Shift Hours", unit: "h" },
  ],
  outputs: [
    { id: "adjustedHour", kind: "number", label: "Adjusted Hour", unit: "h" },
  ],
  calculate: (input) =>
    calculateDaylightSavingShift({
      clockHour: input.clockHour as number,
      shiftHours: input.shiftHours as number,
    }),
});
export const daylightSavingShiftTool = tool;
export const runDaylightSavingShift = tool.execute;
export default tool;
