import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CalibrationLevelOffsetInput = Readonly<{
  readonly referenceDecibels: number;
  readonly measuredDecibels: number;
}>;
export type CalibrationLevelOffsetOutput = Readonly<{
  readonly offsetDecibels: number;
}>;

export const calculateCalibrationLevelOffset = (
  x: CalibrationLevelOffsetInput,
): CalibrationLevelOffsetOutput => {
  if (!Number.isFinite(x.referenceDecibels))
    simpleError("referenceDecibels", "Provide a finite number.");
  if (!Number.isFinite(x.measuredDecibels))
    simpleError("measuredDecibels", "Provide a finite number.");
  const offsetDecibels = x.referenceDecibels - x.measuredDecibels;
  if (!Number.isFinite(offsetDecibels))
    simpleError(
      "offsetDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { offsetDecibels: Object.is(offsetDecibels, -0) ? 0 : offsetDecibels };
};

export const example = {
  input: {
    referenceDecibels: 94,
    measuredDecibels: 93.5,
  },
  output: { offsetDecibels: 0.5 },
} satisfies ToolExample<
  CalibrationLevelOffsetInput,
  CalibrationLevelOffsetOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/calibration-level-offset",
  title: "Calibration Level Offset",
  description:
    "Signed level calibration offset to add to measured readings to match a reference calibrator.",
  inputs: [
    {
      id: "referenceDecibels",
      kind: "number",
      label: "Reference Decibels",
      unit: "dB",
    },
    {
      id: "measuredDecibels",
      kind: "number",
      label: "Measured Decibels",
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "offsetDecibels",
      kind: "number",
      label: "Offset Decibels",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateCalibrationLevelOffset({
      referenceDecibels: input.referenceDecibels as number,
      measuredDecibels: input.measuredDecibels as number,
    }),
});
export const calibrationLevelOffsetTool = tool;
export const runCalibrationLevelOffset = tool.execute;
export default tool;
