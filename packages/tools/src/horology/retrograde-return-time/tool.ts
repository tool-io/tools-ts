import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RetrogradeReturnTimeInput = Readonly<{
  readonly sweepDegrees: number;
  readonly returnSeconds: number;
}>;
export type RetrogradeReturnTimeOutput = Readonly<{
  readonly returnDegreesPerSecond: number;
}>;

export const calculateRetrogradeReturnTime = (
  x: RetrogradeReturnTimeInput,
): RetrogradeReturnTimeOutput => {
  if (!Number.isFinite(x.sweepDegrees) || x.sweepDegrees < 0)
    simpleError("sweepDegrees", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.returnSeconds) || x.returnSeconds <= 0)
    simpleError("returnSeconds", "Provide a finite positive number.");
  const returnDegreesPerSecond = x.sweepDegrees / x.returnSeconds;
  if (!Number.isFinite(returnDegreesPerSecond))
    simpleError(
      "returnDegreesPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    returnDegreesPerSecond: Object.is(returnDegreesPerSecond, -0)
      ? 0
      : returnDegreesPerSecond,
  };
};

export const example = {
  input: {
    sweepDegrees: 120,
    returnSeconds: 0.5,
  },
  output: { returnDegreesPerSecond: 240 },
} satisfies ToolExample<RetrogradeReturnTimeInput, RetrogradeReturnTimeOutput>;

export const tool = createSimpleTool({
  id: "horology/retrograde-return-time",
  title: "Retrograde Return Time",
  description:
    "Average angular return speed in degrees per second from sweep angle and return duration.",
  inputs: [
    {
      id: "sweepDegrees",
      kind: "number",
      label: "Sweep Degrees",
      unit: "deg",
      minimum: 0,
    },
    {
      id: "returnSeconds",
      kind: "number",
      label: "Return Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "returnDegreesPerSecond",
      kind: "number",
      label: "Return Degrees Per Second",
      unit: "deg/s",
    },
  ],
  calculate: (input) =>
    calculateRetrogradeReturnTime({
      sweepDegrees: input.sweepDegrees as number,
      returnSeconds: input.returnSeconds as number,
    }),
});
export const retrogradeReturnTimeTool = tool;
export const runRetrogradeReturnTime = tool.execute;
export default tool;
