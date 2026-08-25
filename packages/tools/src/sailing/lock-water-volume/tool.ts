import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LockWaterVolumeInput = {
  readonly chamberLengthMeters: number;
  readonly chamberWidthMeters: number;
  readonly waterLevelChangeMeters: number;
};

export type LockWaterVolumeOutput = {
  readonly volumeCubicMeters: number;
};

export const lockWaterVolumeExample = {
  input: {
    chamberLengthMeters: 120,
    chamberWidthMeters: 14,
    waterLevelChangeMeters: 3,
  },
  output: { volumeCubicMeters: 5040 },
} satisfies ToolExample<LockWaterVolumeInput, LockWaterVolumeOutput>;

export const calculateLockWaterVolume = (
  input: LockWaterVolumeInput,
): LockWaterVolumeOutput => {
  if (input.chamberLengthMeters <= 0)
    simpleError(
      "chamberLengthMeters",
      "Chamber length must be positive.",
      "invalid_input",
    );
  if (input.chamberWidthMeters <= 0)
    simpleError(
      "chamberWidthMeters",
      "Chamber width must be positive.",
      "invalid_input",
    );
  if (input.waterLevelChangeMeters < 0)
    simpleError(
      "waterLevelChangeMeters",
      "Water level change cannot be negative.",
      "invalid_input",
    );
  return {
    volumeCubicMeters:
      input.chamberLengthMeters *
      input.chamberWidthMeters *
      input.waterLevelChangeMeters,
  };
};

export const lockWaterVolumeTool = createSimpleTool({
  calculate: (input) =>
    calculateLockWaterVolume(input as unknown as LockWaterVolumeInput),
  description:
    "Compute the volume of water moved by a lock filling or emptying as the chamber length times width times the water level change.",
  id: "sailing/lock-water-volume",
  inputs: [
    {
      description: "Internal length of the lock chamber.",
      format: "length-m",
      id: "chamberLengthMeters",
      kind: "number",
      label: "Chamber length",
      unit: "m",
    },
    {
      description: "Internal width of the lock chamber.",
      format: "length-m",
      id: "chamberWidthMeters",
      kind: "number",
      label: "Chamber width",
      unit: "m",
    },
    {
      description:
        "Rise of the water surface inside the chamber during the fill.",
      format: "length-m",
      id: "waterLevelChangeMeters",
      kind: "number",
      label: "Water level change",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Water volume exchanged with each lock operation.",
      format: "length-m3",
      id: "volumeCubicMeters",
      kind: "number",
      label: "Volume",
      unit: "m³",
    },
  ],
  title: "Lock Water Volume Calculator",
});
export const runLockWaterVolume = lockWaterVolumeTool.execute;
export default lockWaterVolumeTool;
