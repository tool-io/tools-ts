import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const pwmResolutionExample = {
  input: { clockHz: 16384, pwmFrequencyHz: 1 },
} satisfies ToolExample<{
  readonly clockHz: number;
  readonly pwmFrequencyHz: number;
}>;

export const pwmResolutionTool = createSimpleTool({
  id: "electronics/pwm-resolution",
  title: "PWM Resolution Bits",
  description:
    "Compute the PWM resolution in bits from the clock frequency and the PWM frequency.",
  inputs: [
    { id: "clockHz", label: "Clock frequency", kind: "number", unit: "Hz" },
    {
      id: "pwmFrequencyHz",
      label: "PWM frequency",
      kind: "number",
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "pwmResolutionBits",
      label: "PWM resolution",
      kind: "number",
      unit: "bits",
    },
  ],
  calculate: (input) => {
    const clockHz = input.clockHz as number;
    const pwmFrequencyHz = input.pwmFrequencyHz as number;
    if (!(clockHz > 0))
      simpleError("clockHz", "Clock frequency must be positive.");
    if (!(pwmFrequencyHz > 0))
      simpleError("pwmFrequencyHz", "PWM frequency must be positive.");
    const ratio = clockHz / pwmFrequencyHz;
    if (!(ratio > 1))
      simpleError(
        "pwmFrequencyHz",
        "Clock frequency must exceed the PWM frequency.",
        "clock_too_slow",
      );
    return { pwmResolutionBits: Math.log2(ratio) };
  },
});
export const runPwmResolution = pwmResolutionTool.execute;
export default pwmResolutionTool;
