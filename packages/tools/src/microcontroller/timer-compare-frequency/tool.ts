import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimerCompareFrequencyInput = Readonly<{
  readonly clockHertz: number;
  readonly prescaler: number;
  readonly compareValue: number;
}>;
export type TimerCompareFrequencyOutput = Readonly<{
  readonly eventHertz: number;
}>;

export const calculateTimerCompareFrequency = (
  x: TimerCompareFrequencyInput,
): TimerCompareFrequencyOutput => {
  if (!Number.isFinite(x.clockHertz) || x.clockHertz < 0)
    simpleError("clockHertz", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.prescaler) ||
    !Number.isSafeInteger(x.prescaler) ||
    x.prescaler < 0
  )
    simpleError("prescaler", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.compareValue) ||
    !Number.isSafeInteger(x.compareValue) ||
    x.compareValue < 0
  )
    simpleError("compareValue", "Provide a safe integer at least 0.");
  if (
    !Number.isSafeInteger(x.prescaler) ||
    x.prescaler < 1 ||
    !Number.isSafeInteger(x.compareValue)
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const eventHertz = x.clockHertz / (x.prescaler * (x.compareValue + 1));
  if (!Number.isFinite(eventHertz))
    simpleError(
      "eventHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { eventHertz: Object.is(eventHertz, -0) ? 0 : eventHertz };
};

export const example = {
  input: { clockHertz: 1000000, prescaler: 8, compareValue: 124 },
  output: { eventHertz: 1000 },
} satisfies ToolExample<
  TimerCompareFrequencyInput,
  TimerCompareFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "microcontroller/timer-compare-frequency",
  title: "Timer Compare Frequency",
  description:
    "Compare-event rate for an up-counter that resets after an inclusive compare value. Enter the effective prescaler divisor; devices with a PSC register may divide by PSC+1.",
  inputs: [
    {
      id: "clockHertz",
      kind: "number",
      label: "Clock Hertz",
      unit: "Hz",
      minimum: 0,
    },
    { id: "prescaler", kind: "integer", label: "Prescaler", minimum: 0 },
    { id: "compareValue", kind: "integer", label: "Compare Value", minimum: 0 },
  ],
  outputs: [
    { id: "eventHertz", kind: "number", label: "Event Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateTimerCompareFrequency({
      clockHertz: input.clockHertz as number,
      prescaler: input.prescaler as number,
      compareValue: input.compareValue as number,
    }),
});
export const timerCompareFrequencyTool = tool;
export const runTimerCompareFrequency = tool.execute;
export default tool;
