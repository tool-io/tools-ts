import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TachymeterBaseCalibrationInput = Readonly<{
  readonly unitsPerEvent: number;
  readonly elapsedSeconds: number;
}>;
export type TachymeterBaseCalibrationOutput = Readonly<{
  readonly unitsPerHour: number;
}>;

export const calculateTachymeterBaseCalibration = (
  x: TachymeterBaseCalibrationInput,
): TachymeterBaseCalibrationOutput => {
  if (!Number.isFinite(x.unitsPerEvent) || x.unitsPerEvent <= 0)
    simpleError("unitsPerEvent", "Provide a finite positive number.");
  if (!Number.isFinite(x.elapsedSeconds) || x.elapsedSeconds <= 0)
    simpleError("elapsedSeconds", "Provide a finite positive number.");
  const unitsPerHour = (3600 * x.unitsPerEvent) / x.elapsedSeconds;
  if (!Number.isFinite(unitsPerHour))
    simpleError(
      "unitsPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { unitsPerHour: Object.is(unitsPerHour, -0) ? 0 : unitsPerHour };
};

export const example = {
  input: {
    unitsPerEvent: 1,
    elapsedSeconds: 30,
  },
  output: { unitsPerHour: 120 },
} satisfies ToolExample<
  TachymeterBaseCalibrationInput,
  TachymeterBaseCalibrationOutput
>;

export const tool = createSimpleTool({
  id: "horology/tachymeter-base-calibration",
  title: "Tachymeter Base Calibration",
  description:
    "Tachymeter dial reading in units per hour for one event completed in the supplied elapsed seconds.",
  inputs: [
    {
      id: "unitsPerEvent",
      kind: "number",
      label: "Units Per Event",
      minimum: 0,
    },
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
      id: "unitsPerHour",
      kind: "number",
      label: "Units Per Hour",
      unit: "1/h",
    },
  ],
  calculate: (input) =>
    calculateTachymeterBaseCalibration({
      unitsPerEvent: input.unitsPerEvent as number,
      elapsedSeconds: input.elapsedSeconds as number,
    }),
});
export const tachymeterBaseCalibrationTool = tool;
export const runTachymeterBaseCalibration = tool.execute;
export default tool;
