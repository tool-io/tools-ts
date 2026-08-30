import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PulsometerHeartRateInput = Readonly<{
  readonly beatCount: number;
  readonly elapsedSeconds: number;
}>;
export type PulsometerHeartRateOutput = Readonly<{
  readonly beatsPerMinute: number;
}>;

export const calculatePulsometerHeartRate = (
  x: PulsometerHeartRateInput,
): PulsometerHeartRateOutput => {
  if (
    !Number.isFinite(x.beatCount) ||
    !Number.isSafeInteger(x.beatCount) ||
    x.beatCount < 1
  )
    simpleError("beatCount", "Provide a positive safe integer.");
  if (!Number.isFinite(x.elapsedSeconds) || x.elapsedSeconds <= 0)
    simpleError("elapsedSeconds", "Provide a finite positive number.");
  const beatsPerMinute = (60 * x.beatCount) / x.elapsedSeconds;
  if (!Number.isFinite(beatsPerMinute))
    simpleError(
      "beatsPerMinute",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { beatsPerMinute: Object.is(beatsPerMinute, -0) ? 0 : beatsPerMinute };
};

export const example = {
  input: {
    beatCount: 30,
    elapsedSeconds: 20,
  },
  output: { beatsPerMinute: 90 },
} satisfies ToolExample<PulsometerHeartRateInput, PulsometerHeartRateOutput>;

export const tool = createSimpleTool({
  id: "horology/pulsometer-heart-rate",
  title: "Pulsometer Heart Rate",
  description:
    "Heartbeats per minute from a counted number of beats and elapsed seconds.",
  inputs: [
    { id: "beatCount", kind: "integer", label: "Beat Count", minimum: 1 },
    {
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "beatsPerMinute",
      kind: "number",
      label: "Beats Per Minute",
      unit: "bpm",
    },
  ],
  calculate: (input) =>
    calculatePulsometerHeartRate({
      beatCount: input.beatCount as number,
      elapsedSeconds: input.elapsedSeconds as number,
    }),
});
export const pulsometerHeartRateTool = tool;
export const runPulsometerHeartRate = tool.execute;
export default tool;
