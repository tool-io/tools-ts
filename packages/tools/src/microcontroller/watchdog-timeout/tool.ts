import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WatchdogTimeoutInput = Readonly<{
  readonly clockHertz: number;
  readonly prescaler: number;
  readonly reloadValue: number;
}>;
export type WatchdogTimeoutOutput = Readonly<{
  readonly timeoutSeconds: number;
}>;

export const calculateWatchdogTimeout = (
  x: WatchdogTimeoutInput,
): WatchdogTimeoutOutput => {
  if (!Number.isFinite(x.clockHertz) || x.clockHertz < 0)
    simpleError("clockHertz", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.prescaler) ||
    !Number.isSafeInteger(x.prescaler) ||
    x.prescaler < 0
  )
    simpleError("prescaler", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.reloadValue) ||
    !Number.isSafeInteger(x.reloadValue) ||
    x.reloadValue < 0
  )
    simpleError("reloadValue", "Provide a safe integer at least 0.");
  if (
    !Number.isSafeInteger(x.prescaler) ||
    x.prescaler < 1 ||
    !Number.isSafeInteger(x.reloadValue)
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const timeoutSeconds = (x.prescaler * (x.reloadValue + 1)) / x.clockHertz;
  if (!Number.isFinite(timeoutSeconds))
    simpleError(
      "timeoutSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { timeoutSeconds: Object.is(timeoutSeconds, -0) ? 0 : timeoutSeconds };
};

export const example = {
  input: { clockHertz: 32000, prescaler: 32, reloadValue: 999 },
  output: { timeoutSeconds: 1 },
} satisfies ToolExample<WatchdogTimeoutInput, WatchdogTimeoutOutput>;

export const tool = createSimpleTool({
  id: "microcontroller/watchdog-timeout",
  title: "Watchdog Timeout",
  description:
    "Nominal watchdog timeout for an inclusive reload counter. Prescaler is the effective watchdog-clock divisor; verify the device's register encoding and oscillator tolerance.",
  inputs: [
    {
      id: "clockHertz",
      kind: "number",
      label: "Clock Hertz",
      unit: "Hz",
      minimum: 0,
    },
    { id: "prescaler", kind: "integer", label: "Prescaler", minimum: 0 },
    { id: "reloadValue", kind: "integer", label: "Reload Value", minimum: 0 },
  ],
  outputs: [
    {
      id: "timeoutSeconds",
      kind: "number",
      label: "Timeout Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateWatchdogTimeout({
      clockHertz: input.clockHertz as number,
      prescaler: input.prescaler as number,
      reloadValue: input.reloadValue as number,
    }),
});
export const watchdogTimeoutTool = tool;
export const runWatchdogTimeout = tool.execute;
export default tool;
