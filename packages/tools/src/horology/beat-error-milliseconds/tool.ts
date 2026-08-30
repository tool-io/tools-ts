import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeatErrorMillisecondsInput = Readonly<{
  readonly longIntervalMilliseconds: number;
  readonly shortIntervalMilliseconds: number;
}>;
export type BeatErrorMillisecondsOutput = Readonly<{
  readonly beatErrorMilliseconds: number;
}>;

export const calculateBeatErrorMilliseconds = (
  x: BeatErrorMillisecondsInput,
): BeatErrorMillisecondsOutput => {
  if (
    !Number.isFinite(x.longIntervalMilliseconds) ||
    x.longIntervalMilliseconds <= 0
  )
    simpleError(
      "longIntervalMilliseconds",
      "Provide a finite positive number.",
    );
  if (
    !Number.isFinite(x.shortIntervalMilliseconds) ||
    x.shortIntervalMilliseconds <= 0
  )
    simpleError(
      "shortIntervalMilliseconds",
      "Provide a finite positive number.",
    );
  const beatErrorMilliseconds =
    Math.abs(x.longIntervalMilliseconds - x.shortIntervalMilliseconds) / 2;
  if (!Number.isFinite(beatErrorMilliseconds))
    simpleError(
      "beatErrorMilliseconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    beatErrorMilliseconds: Object.is(beatErrorMilliseconds, -0)
      ? 0
      : beatErrorMilliseconds,
  };
};

export const example = {
  input: {
    longIntervalMilliseconds: 125.5,
    shortIntervalMilliseconds: 124.5,
  },
  output: { beatErrorMilliseconds: 0.5 },
} satisfies ToolExample<
  BeatErrorMillisecondsInput,
  BeatErrorMillisecondsOutput
>;

export const tool = createSimpleTool({
  id: "horology/beat-error-milliseconds",
  title: "Beat Error Milliseconds",
  description:
    "Timegrapher beat error as half the absolute difference between alternating long and short beat intervals.",
  inputs: [
    {
      id: "longIntervalMilliseconds",
      kind: "number",
      label: "Long Interval Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "shortIntervalMilliseconds",
      kind: "number",
      label: "Short Interval Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "beatErrorMilliseconds",
      kind: "number",
      label: "Beat Error Milliseconds",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculateBeatErrorMilliseconds({
      longIntervalMilliseconds: input.longIntervalMilliseconds as number,
      shortIntervalMilliseconds: input.shortIntervalMilliseconds as number,
    }),
});
export const beatErrorMillisecondsTool = tool;
export const runBeatErrorMilliseconds = tool.execute;
export default tool;
