import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DayNightLevelDnlInput = Readonly<{
  readonly dayLeqDecibels: number;
  readonly nightLeqDecibels: number;
}>;
export type DayNightLevelDnlOutput = Readonly<{
  readonly dnlDecibels: number;
}>;

export const calculateDayNightLevelDnl = (
  x: DayNightLevelDnlInput,
): DayNightLevelDnlOutput => {
  if (!Number.isFinite(x.dayLeqDecibels))
    simpleError("dayLeqDecibels", "Provide a finite number.");
  if (!Number.isFinite(x.nightLeqDecibels))
    simpleError("nightLeqDecibels", "Provide a finite number.");
  const dnlDecibels =
    10 *
    Math.log10(
      (15 * 10 ** (x.dayLeqDecibels / 10) +
        9 * 10 ** ((x.nightLeqDecibels + 10) / 10)) /
        24,
    );
  if (!Number.isFinite(dnlDecibels))
    simpleError(
      "dnlDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { dnlDecibels: Object.is(dnlDecibels, -0) ? 0 : dnlDecibels };
};

export const example = {
  input: {
    dayLeqDecibels: 60,
    nightLeqDecibels: 50,
  },
  output: { dnlDecibels: 60 },
} satisfies ToolExample<DayNightLevelDnlInput, DayNightLevelDnlOutput>;

export const tool = createSimpleTool({
  id: "acoustics/day-night-level-dnl",
  title: "Day Night Level Dnl",
  description:
    "24-hour day-night level from representative 15-hour day and 9-hour night Leq, with a 10 dB night penalty.",
  inputs: [
    {
      id: "dayLeqDecibels",
      kind: "number",
      label: "Day Leq Decibels",
      unit: "dB",
    },
    {
      id: "nightLeqDecibels",
      kind: "number",
      label: "Night Leq Decibels",
      unit: "dB",
    },
  ],
  outputs: [
    { id: "dnlDecibels", kind: "number", label: "Dnl Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateDayNightLevelDnl({
      dayLeqDecibels: input.dayLeqDecibels as number,
      nightLeqDecibels: input.nightLeqDecibels as number,
    }),
});
export const dayNightLevelDnlTool = tool;
export const runDayNightLevelDnl = tool.execute;
export default tool;
