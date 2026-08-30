import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AudioLimiterAttackTimeInput = Readonly<{
  readonly tenPercentMilliseconds: number;
  readonly ninetyPercentMilliseconds: number;
}>;
export type AudioLimiterAttackTimeOutput = Readonly<{
  readonly timeConstantMilliseconds: number;
}>;

export const calculateAudioLimiterAttackTime = (
  x: AudioLimiterAttackTimeInput,
): AudioLimiterAttackTimeOutput => {
  if (
    !Number.isFinite(x.tenPercentMilliseconds) ||
    x.tenPercentMilliseconds < 0
  )
    simpleError(
      "tenPercentMilliseconds",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.ninetyPercentMilliseconds) ||
    x.ninetyPercentMilliseconds < 0
  )
    simpleError(
      "ninetyPercentMilliseconds",
      "Provide a finite number at least 0.",
    );
  if (x.ninetyPercentMilliseconds <= x.tenPercentMilliseconds)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const timeConstantMilliseconds =
    (x.ninetyPercentMilliseconds - x.tenPercentMilliseconds) / Math.log(9);
  if (!Number.isFinite(timeConstantMilliseconds))
    simpleError(
      "timeConstantMilliseconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    timeConstantMilliseconds: Object.is(timeConstantMilliseconds, -0)
      ? 0
      : timeConstantMilliseconds,
  };
};

export const example = {
  input: { tenPercentMilliseconds: 1, ninetyPercentMilliseconds: 12 },
  output: { timeConstantMilliseconds: 5.006315746447605 },
} satisfies ToolExample<
  AudioLimiterAttackTimeInput,
  AudioLimiterAttackTimeOutput
>;

export const tool = createSimpleTool({
  id: "electronics/audio-limiter-attack-time",
  title: "Audio Limiter Attack Time",
  description:
    "First-order limiter envelope attack time constant from observed 10% and 90% response-crossing times.",
  inputs: [
    {
      id: "tenPercentMilliseconds",
      kind: "number",
      label: "Ten Percent Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "ninetyPercentMilliseconds",
      kind: "number",
      label: "Ninety Percent Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "timeConstantMilliseconds",
      kind: "number",
      label: "Time Constant Milliseconds",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculateAudioLimiterAttackTime({
      tenPercentMilliseconds: input.tenPercentMilliseconds as number,
      ninetyPercentMilliseconds: input.ninetyPercentMilliseconds as number,
    }),
});
export const audioLimiterAttackTimeTool = tool;
export const runAudioLimiterAttackTime = tool.execute;
export default tool;
