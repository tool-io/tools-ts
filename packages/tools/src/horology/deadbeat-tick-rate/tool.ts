import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeadbeatTickRateInput = Readonly<{
  readonly jumpsPerMinute: number;
}>;
export type DeadbeatTickRateOutput = Readonly<{
  readonly jumpsPerSecond: number;
}>;

export const calculateDeadbeatTickRate = (
  x: DeadbeatTickRateInput,
): DeadbeatTickRateOutput => {
  if (!Number.isFinite(x.jumpsPerMinute) || x.jumpsPerMinute <= 0)
    simpleError("jumpsPerMinute", "Provide a finite positive number.");
  const jumpsPerSecond = x.jumpsPerMinute / 60;
  if (!Number.isFinite(jumpsPerSecond))
    simpleError(
      "jumpsPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { jumpsPerSecond: Object.is(jumpsPerSecond, -0) ? 0 : jumpsPerSecond };
};

export const example = {
  input: {
    jumpsPerMinute: 60,
  },
  output: { jumpsPerSecond: 1 },
} satisfies ToolExample<DeadbeatTickRateInput, DeadbeatTickRateOutput>;

export const tool = createSimpleTool({
  id: "horology/deadbeat-tick-rate",
  title: "Deadbeat Tick Rate",
  description:
    "Deadbeat seconds-hand jumps per second from supplied jumps per minute.",
  inputs: [
    {
      id: "jumpsPerMinute",
      kind: "number",
      label: "Jumps Per Minute",
      unit: "jump/min",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "jumpsPerSecond",
      kind: "number",
      label: "Jumps Per Second",
      unit: "jump/s",
    },
  ],
  calculate: (input) =>
    calculateDeadbeatTickRate({
      jumpsPerMinute: input.jumpsPerMinute as number,
    }),
});
export const deadbeatTickRateTool = tool;
export const runDeadbeatTickRate = tool.execute;
export default tool;
