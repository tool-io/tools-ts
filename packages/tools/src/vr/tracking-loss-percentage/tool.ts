import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrackingLossPercentageInput = Readonly<{
  readonly lostMilliseconds: number;
  readonly sessionMilliseconds: number;
}>;
export type TrackingLossPercentageOutput = Readonly<{
  readonly lossPercent: number;
}>;

export const calculateTrackingLossPercentage = (
  x: TrackingLossPercentageInput,
): TrackingLossPercentageOutput => {
  if (!Number.isFinite(x.lostMilliseconds) || x.lostMilliseconds < 0)
    simpleError("lostMilliseconds", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.sessionMilliseconds) || x.sessionMilliseconds <= 0)
    simpleError("sessionMilliseconds", "Provide a finite positive number.");
  if (!(x.lostMilliseconds <= x.sessionMilliseconds))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const lossPercent = (100 * x.lostMilliseconds) / x.sessionMilliseconds;
  if (!Number.isFinite(lossPercent))
    simpleError(
      "lossPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { lossPercent: Object.is(lossPercent, -0) ? 0 : lossPercent };
};

export const example = {
  input: {
    lostMilliseconds: 500,
    sessionMilliseconds: 100000,
  },
  output: { lossPercent: 0.5 },
} satisfies ToolExample<
  TrackingLossPercentageInput,
  TrackingLossPercentageOutput
>;

export const tool = createSimpleTool({
  id: "vr/tracking-loss-percentage",
  title: "Tracking Loss Percentage",
  description:
    "Lost tracking time as a percentage of a measured session duration.",
  inputs: [
    {
      id: "lostMilliseconds",
      kind: "number",
      label: "Lost Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "sessionMilliseconds",
      kind: "number",
      label: "Session Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "lossPercent",
      kind: "number",
      label: "Loss Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateTrackingLossPercentage({
      lostMilliseconds: input.lostMilliseconds as number,
      sessionMilliseconds: input.sessionMilliseconds as number,
    }),
});
export const trackingLossPercentageTool = tool;
export const runTrackingLossPercentage = tool.execute;
export default tool;
