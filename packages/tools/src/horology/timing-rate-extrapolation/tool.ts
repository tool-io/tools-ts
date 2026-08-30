import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimingRateExtrapolationInput = Readonly<{
  readonly observedErrorSeconds: number;
  readonly observationHours: number;
}>;
export type TimingRateExtrapolationOutput = Readonly<{
  readonly secondsPerDay: number;
}>;

export const calculateTimingRateExtrapolation = (
  x: TimingRateExtrapolationInput,
): TimingRateExtrapolationOutput => {
  if (!Number.isFinite(x.observedErrorSeconds))
    simpleError("observedErrorSeconds", "Provide a finite number.");
  if (!Number.isFinite(x.observationHours) || x.observationHours <= 0)
    simpleError("observationHours", "Provide a finite positive number.");
  const secondsPerDay = (24 * x.observedErrorSeconds) / x.observationHours;
  if (!Number.isFinite(secondsPerDay))
    simpleError(
      "secondsPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { secondsPerDay: Object.is(secondsPerDay, -0) ? 0 : secondsPerDay };
};

export const example = {
  input: {
    observedErrorSeconds: 1,
    observationHours: 12,
  },
  output: { secondsPerDay: 2 },
} satisfies ToolExample<
  TimingRateExtrapolationInput,
  TimingRateExtrapolationOutput
>;

export const tool = createSimpleTool({
  id: "horology/timing-rate-extrapolation",
  title: "Timing Rate Extrapolation",
  description:
    "Extrapolated seconds gained or lost per 24 hours from a measured signed error over an observation interval.",
  inputs: [
    {
      id: "observedErrorSeconds",
      kind: "number",
      label: "Observed Error Seconds",
      unit: "s",
    },
    {
      id: "observationHours",
      kind: "number",
      label: "Observation Hours",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "secondsPerDay",
      kind: "number",
      label: "Seconds Per Day",
      unit: "s/day",
    },
  ],
  calculate: (input) =>
    calculateTimingRateExtrapolation({
      observedErrorSeconds: input.observedErrorSeconds as number,
      observationHours: input.observationHours as number,
    }),
});
export const timingRateExtrapolationTool = tool;
export const runTimingRateExtrapolation = tool.execute;
export default tool;
