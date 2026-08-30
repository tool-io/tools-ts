import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MoonphaseGearRatioInput = Readonly<{
  readonly discTeeth: number;
  readonly advancesPerDay: number;
}>;
export type MoonphaseGearRatioOutput = Readonly<{
  readonly displayCycleDays: number;
}>;

export const calculateMoonphaseGearRatio = (
  x: MoonphaseGearRatioInput,
): MoonphaseGearRatioOutput => {
  if (
    !Number.isFinite(x.discTeeth) ||
    !Number.isSafeInteger(x.discTeeth) ||
    x.discTeeth < 1
  )
    simpleError("discTeeth", "Provide a positive safe integer.");
  if (!Number.isFinite(x.advancesPerDay) || x.advancesPerDay <= 0)
    simpleError("advancesPerDay", "Provide a finite positive number.");
  const displayCycleDays = x.discTeeth / x.advancesPerDay;
  if (!Number.isFinite(displayCycleDays))
    simpleError(
      "displayCycleDays",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    displayCycleDays: Object.is(displayCycleDays, -0) ? 0 : displayCycleDays,
  };
};

export const example = {
  input: {
    discTeeth: 59,
    advancesPerDay: 2,
  },
  output: { displayCycleDays: 29.5 },
} satisfies ToolExample<MoonphaseGearRatioInput, MoonphaseGearRatioOutput>;

export const tool = createSimpleTool({
  id: "horology/moonphase-gear-ratio",
  title: "Moonphase Gear Ratio",
  description:
    "Display-cycle days from moon-disc tooth count and tooth advances per day.",
  inputs: [
    { id: "discTeeth", kind: "integer", label: "Disc Teeth", minimum: 1 },
    {
      id: "advancesPerDay",
      kind: "number",
      label: "Advances Per Day",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "displayCycleDays",
      kind: "number",
      label: "Display Cycle Days",
      unit: "day",
    },
  ],
  calculate: (input) =>
    calculateMoonphaseGearRatio({
      discTeeth: input.discTeeth as number,
      advancesPerDay: input.advancesPerDay as number,
    }),
});
export const moonphaseGearRatioTool = tool;
export const runMoonphaseGearRatio = tool.execute;
export default tool;
