import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AlarmSetOffsetInput = Readonly<{
  readonly currentMinuteOfDay: number;
  readonly alarmMinuteOfDay: number;
}>;
export type AlarmSetOffsetOutput = Readonly<{
  readonly minutesUntilAlarm: number;
}>;

export const calculateAlarmSetOffset = (
  x: AlarmSetOffsetInput,
): AlarmSetOffsetOutput => {
  if (!Number.isFinite(x.currentMinuteOfDay) || x.currentMinuteOfDay < 0)
    simpleError("currentMinuteOfDay", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.alarmMinuteOfDay) || x.alarmMinuteOfDay < 0)
    simpleError("alarmMinuteOfDay", "Provide a finite nonnegative number.");
  if (!(
    Number.isInteger(x.currentMinuteOfDay) &&
    Number.isInteger(x.alarmMinuteOfDay) &&
    x.currentMinuteOfDay < 1440 &&
    x.alarmMinuteOfDay < 1440
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const minutesUntilAlarm =
    (x.alarmMinuteOfDay - x.currentMinuteOfDay + 1440) % 1440;
  if (!Number.isFinite(minutesUntilAlarm))
    simpleError(
      "minutesUntilAlarm",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    minutesUntilAlarm: Object.is(minutesUntilAlarm, -0) ? 0 : minutesUntilAlarm,
  };
};

export const example = {
  input: {
    currentMinuteOfDay: 600,
    alarmMinuteOfDay: 660,
  },
  output: { minutesUntilAlarm: 60 },
} satisfies ToolExample<AlarmSetOffsetInput, AlarmSetOffsetOutput>;

export const tool = createSimpleTool({
  id: "horology/alarm-set-offset",
  title: "Alarm Set Offset",
  description:
    "Forward minutes from current clock time to an alarm time, wrapping at 24 hours.",
  inputs: [
    {
      id: "currentMinuteOfDay",
      kind: "number",
      label: "Current Minute Of Day",
      unit: "min",
      minimum: 0,
    },
    {
      id: "alarmMinuteOfDay",
      kind: "number",
      label: "Alarm Minute Of Day",
      unit: "min",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "minutesUntilAlarm",
      kind: "number",
      label: "Minutes Until Alarm",
      unit: "min",
    },
  ],
  calculate: (input) =>
    calculateAlarmSetOffset({
      currentMinuteOfDay: input.currentMinuteOfDay as number,
      alarmMinuteOfDay: input.alarmMinuteOfDay as number,
    }),
});
export const alarmSetOffsetTool = tool;
export const runAlarmSetOffset = tool.execute;
export default tool;
