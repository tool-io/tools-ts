import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FeedRateInput = Readonly<{
  readonly feedMillimetersPerTooth: number;
  readonly teeth: number;
  readonly speedRpm: number;
}>;
export type FeedRateOutput = Readonly<{
  readonly millimetersPerMinute: number;
}>;

export const calculateFeedRate = (x: FeedRateInput): FeedRateOutput => {
  if (
    !Number.isFinite(x.feedMillimetersPerTooth) ||
    x.feedMillimetersPerTooth < 0
  )
    simpleError(
      "feedMillimetersPerTooth",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.teeth) || x.teeth < 1)
    simpleError("teeth", "Provide a positive integer.");
  if (!Number.isFinite(x.speedRpm) || x.speedRpm < 0)
    simpleError("speedRpm", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.teeth))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const millimetersPerMinute = x.feedMillimetersPerTooth * x.teeth * x.speedRpm;
  if (!Number.isFinite(millimetersPerMinute))
    simpleError(
      "millimetersPerMinute",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    millimetersPerMinute: Object.is(millimetersPerMinute, -0)
      ? 0
      : millimetersPerMinute,
  };
};

export const example = {
  input: { feedMillimetersPerTooth: 0.1, teeth: 4, speedRpm: 1000 },
  output: { millimetersPerMinute: 400 },
} satisfies ToolExample<FeedRateInput, FeedRateOutput>;

export const tool = createSimpleTool({
  id: "engineering/feed-rate",
  title: "Feed Rate",
  description:
    "Milling table feed rate from feed per tooth, cutter flute count and spindle RPM.",
  inputs: [
    {
      id: "feedMillimetersPerTooth",
      kind: "number",
      label: "Feed Millimeters Per Tooth",
      unit: "mm/tooth",
      minimum: 0,
    },
    { id: "teeth", kind: "integer", label: "Teeth", minimum: 1 },
    {
      id: "speedRpm",
      kind: "number",
      label: "Speed Rpm",
      unit: "rpm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "millimetersPerMinute",
      kind: "number",
      label: "Millimeters Per Minute",
      unit: "mm/min",
    },
  ],
  calculate: (input) =>
    calculateFeedRate({
      feedMillimetersPerTooth: input.feedMillimetersPerTooth as number,
      teeth: input.teeth as number,
      speedRpm: input.speedRpm as number,
    }),
});
export const feedRateTool = tool;
export const runFeedRate = tool.execute;
export default tool;
