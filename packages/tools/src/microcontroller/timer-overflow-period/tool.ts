import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimerOverflowPeriodInput = Readonly<{
  readonly clockHertz: number;
  readonly prescaler: number;
  readonly counterBits: number;
}>;
export type TimerOverflowPeriodOutput = Readonly<{
  readonly overflowSeconds: number;
}>;

export const calculateTimerOverflowPeriod = (
  x: TimerOverflowPeriodInput,
): TimerOverflowPeriodOutput => {
  if (!Number.isFinite(x.clockHertz) || x.clockHertz < 0)
    simpleError("clockHertz", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.prescaler) ||
    !Number.isSafeInteger(x.prescaler) ||
    x.prescaler < 0
  )
    simpleError("prescaler", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.counterBits) ||
    !Number.isSafeInteger(x.counterBits) ||
    x.counterBits < 0
  )
    simpleError("counterBits", "Provide a safe integer at least 0.");
  if (
    !Number.isSafeInteger(x.prescaler) ||
    x.prescaler < 1 ||
    !Number.isSafeInteger(x.counterBits) ||
    x.counterBits < 1 ||
    x.counterBits > 52
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const overflowSeconds = (x.prescaler * 2 ** x.counterBits) / x.clockHertz;
  if (!Number.isFinite(overflowSeconds))
    simpleError(
      "overflowSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    overflowSeconds: Object.is(overflowSeconds, -0) ? 0 : overflowSeconds,
  };
};

export const example = {
  input: { clockHertz: 1000000, prescaler: 8, counterBits: 16 },
  output: { overflowSeconds: 0.524288 },
} satisfies ToolExample<TimerOverflowPeriodInput, TimerOverflowPeriodOutput>;

export const tool = createSimpleTool({
  id: "microcontroller/timer-overflow-period",
  title: "Timer Overflow Period",
  description:
    "Overflow interval for a free-running N-bit timer with a zero-based counter. Prescaler is the effective clock divisor, not necessarily the raw register value.",
  inputs: [
    {
      id: "clockHertz",
      kind: "number",
      label: "Clock Hertz",
      unit: "Hz",
      minimum: 0,
    },
    { id: "prescaler", kind: "integer", label: "Prescaler", minimum: 0 },
    {
      id: "counterBits",
      kind: "integer",
      label: "Counter Bits",
      unit: "bits",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "overflowSeconds",
      kind: "number",
      label: "Overflow Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateTimerOverflowPeriod({
      clockHertz: input.clockHertz as number,
      prescaler: input.prescaler as number,
      counterBits: input.counterBits as number,
    }),
});
export const timerOverflowPeriodTool = tool;
export const runTimerOverflowPeriod = tool.execute;
export default tool;
