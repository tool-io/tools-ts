import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimerTickPeriodInput = Readonly<{
  readonly clockHertz: number;
  readonly prescaler: number;
}>;
export type TimerTickPeriodOutput = Readonly<{
  readonly tickSeconds: number;
}>;

export const calculateTimerTickPeriod = (
  x: TimerTickPeriodInput,
): TimerTickPeriodOutput => {
  if (!Number.isFinite(x.clockHertz) || x.clockHertz < 0)
    simpleError("clockHertz", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.prescaler) ||
    !Number.isSafeInteger(x.prescaler) ||
    x.prescaler < 0
  )
    simpleError("prescaler", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.prescaler) || x.prescaler < 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const tickSeconds = x.prescaler / x.clockHertz;
  if (!Number.isFinite(tickSeconds))
    simpleError(
      "tickSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { tickSeconds: Object.is(tickSeconds, -0) ? 0 : tickSeconds };
};

export const example = {
  input: { clockHertz: 1000000, prescaler: 8 },
  output: { tickSeconds: 0.000008 },
} satisfies ToolExample<TimerTickPeriodInput, TimerTickPeriodOutput>;

export const tool = createSimpleTool({
  id: "microcontroller/timer-tick-period",
  title: "Timer Tick Period",
  description:
    "Timer tick interval from source clock and the effective prescaler divisor, before rollover or compare logic. If a device uses a PSC register with divisor PSC+1, enter PSC+1.",
  inputs: [
    {
      id: "clockHertz",
      kind: "number",
      label: "Clock Hertz",
      unit: "Hz",
      minimum: 0,
    },
    { id: "prescaler", kind: "integer", label: "Prescaler", minimum: 0 },
  ],
  outputs: [
    { id: "tickSeconds", kind: "number", label: "Tick Seconds", unit: "s" },
  ],
  calculate: (input) =>
    calculateTimerTickPeriod({
      clockHertz: input.clockHertz as number,
      prescaler: input.prescaler as number,
    }),
});
export const timerTickPeriodTool = tool;
export const runTimerTickPeriod = tool.execute;
export default tool;
