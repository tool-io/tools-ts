import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PersistentShiftRateInput = {
  readonly newMeanHeadingDeg: number;
  readonly oldMeanHeadingDeg: number;
  readonly elapsedMinutes: number;
};

export type PersistentShiftRateOutput = {
  readonly rateDegPerMinute: number;
};

export const persistentShiftRateExample = {
  input: { newMeanHeadingDeg: 310, oldMeanHeadingDeg: 295, elapsedMinutes: 30 },
  output: { rateDegPerMinute: 0.5 },
} satisfies ToolExample<PersistentShiftRateInput, PersistentShiftRateOutput>;

export const calculatePersistentShiftRate = (
  input: PersistentShiftRateInput,
): PersistentShiftRateOutput => {
  if (!(input.elapsedMinutes > 0))
    simpleError(
      "elapsedMinutes",
      "Elapsed minutes must be positive.",
      "invalid_elapsed",
    );
  const headingChangeDeg =
    ((input.newMeanHeadingDeg - input.oldMeanHeadingDeg + 540) % 360) - 180;
  return { rateDegPerMinute: headingChangeDeg / input.elapsedMinutes };
};

export const persistentShiftRateTool = createSimpleTool({
  id: "sailing/persistent-shift-rate",
  title: "Shift Rate Calculator",
  description:
    "Compute the signed rate of the shortest compass-direction change between two mean wind headings, correctly handling the wrap across north.",
  inputs: [
    {
      description: "Mean heading after the shift.",
      id: "newMeanHeadingDeg",
      kind: "number",
      label: "New mean heading",
      unit: "\u00B0",
    },
    {
      description: "Mean heading before the shift.",
      id: "oldMeanHeadingDeg",
      kind: "number",
      label: "Old mean heading",
      unit: "\u00B0",
    },
    {
      description: "Minutes elapsed between the two mean headings.",
      id: "elapsedMinutes",
      kind: "number",
      label: "Elapsed time",
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Signed heading change per minute.",
      format: "angle-deg",
      id: "rateDegPerMinute",
      kind: "number",
      label: "Shift rate",
      unit: "\u00B0/min",
    },
  ],
  calculate: (input) =>
    calculatePersistentShiftRate(input as unknown as PersistentShiftRateInput),
});

export const runPersistentShiftRate = persistentShiftRateTool.execute;
export default persistentShiftRateTool;
