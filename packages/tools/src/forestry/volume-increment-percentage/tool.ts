import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VolumeIncrementPercentageInput = Readonly<{
  readonly startingVolume: number;
  readonly endingVolume: number;
}>;
export type VolumeIncrementPercentageOutput = Readonly<{
  readonly incrementPercent: number;
}>;

export const calculateVolumeIncrementPercentage = (
  x: VolumeIncrementPercentageInput,
): VolumeIncrementPercentageOutput => {
  if (!Number.isFinite(x.startingVolume) || x.startingVolume <= 0)
    simpleError("startingVolume", "Provide a finite positive number.");
  if (!Number.isFinite(x.endingVolume) || x.endingVolume < 0)
    simpleError("endingVolume", "Provide a finite nonnegative number.");
  const incrementPercent =
    (100 * (x.endingVolume - x.startingVolume)) / x.startingVolume;
  if (!Number.isFinite(incrementPercent))
    simpleError(
      "incrementPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    incrementPercent: Object.is(incrementPercent, -0) ? 0 : incrementPercent,
  };
};

export const example = {
  input: {
    startingVolume: 100,
    endingVolume: 120,
  },
  output: { incrementPercent: 20 },
} satisfies ToolExample<
  VolumeIncrementPercentageInput,
  VolumeIncrementPercentageOutput
>;

export const tool = createSimpleTool({
  id: "forestry/volume-increment-percentage",
  title: "Volume Increment Percentage",
  description: "Percentage change in stand volume from start to end inventory.",
  inputs: [
    {
      id: "startingVolume",
      kind: "number",
      label: "Starting Volume",
      unit: "m3/ha",
      minimum: 0,
    },
    {
      id: "endingVolume",
      kind: "number",
      label: "Ending Volume",
      unit: "m3/ha",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "incrementPercent",
      kind: "number",
      label: "Increment Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateVolumeIncrementPercentage({
      startingVolume: input.startingVolume as number,
      endingVolume: input.endingVolume as number,
    }),
});
export const volumeIncrementPercentageTool = tool;
export const runVolumeIncrementPercentage = tool.execute;
export default tool;
