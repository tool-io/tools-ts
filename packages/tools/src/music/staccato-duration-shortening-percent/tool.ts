import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StaccatoDurationShorteningPercentInput = Readonly<{
  readonly writtenSeconds: number;
  readonly shorteningPercent: number;
}>;
export type StaccatoDurationShorteningPercentOutput = Readonly<{
  readonly soundingSeconds: number;
}>;

export const calculateStaccatoDurationShorteningPercent = (
  x: StaccatoDurationShorteningPercentInput,
): StaccatoDurationShorteningPercentOutput => {
  if (!Number.isFinite(x.writtenSeconds) || x.writtenSeconds <= 0)
    simpleError("writtenSeconds", "Provide a finite positive number.");
  if (!Number.isFinite(x.shorteningPercent) || x.shorteningPercent < 0)
    simpleError("shorteningPercent", "Provide a finite nonnegative number.");
  if (!(x.shorteningPercent <= 100))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const soundingSeconds = x.writtenSeconds * (1 - x.shorteningPercent / 100);
  if (!Number.isFinite(soundingSeconds))
    simpleError(
      "soundingSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    soundingSeconds: Object.is(soundingSeconds, -0) ? 0 : soundingSeconds,
  };
};

export const example = {
  input: {
    writtenSeconds: 1,
    shorteningPercent: 50,
  },
  output: { soundingSeconds: 0.5 },
} satisfies ToolExample<
  StaccatoDurationShorteningPercentInput,
  StaccatoDurationShorteningPercentOutput
>;

export const tool = createSimpleTool({
  id: "music/staccato-duration-shortening-percent",
  title: "Staccato Duration Shortening Percent",
  description:
    "Sounding duration after shortening a written note by a specified percentage for staccato articulation.",
  inputs: [
    {
      id: "writtenSeconds",
      kind: "number",
      label: "Written Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "shorteningPercent",
      kind: "number",
      label: "Shortening Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "soundingSeconds",
      kind: "number",
      label: "Sounding Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateStaccatoDurationShorteningPercent({
      writtenSeconds: input.writtenSeconds as number,
      shorteningPercent: input.shorteningPercent as number,
    }),
});
export const staccatoDurationShorteningPercentTool = tool;
export const runStaccatoDurationShorteningPercent = tool.execute;
export default tool;
