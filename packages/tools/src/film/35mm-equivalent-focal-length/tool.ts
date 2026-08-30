import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThirtyFiveMmEquivalentFocalLengthInput = Readonly<{
  readonly actualFocalMillimeters: number;
  readonly sensorDiagonalMillimeters: number;
}>;
export type ThirtyFiveMmEquivalentFocalLengthOutput = Readonly<{
  readonly equivalentFocalMillimeters: number;
}>;

export const calculateThirtyFiveMmEquivalentFocalLength = (
  x: ThirtyFiveMmEquivalentFocalLengthInput,
): ThirtyFiveMmEquivalentFocalLengthOutput => {
  if (
    !Number.isFinite(x.actualFocalMillimeters) ||
    x.actualFocalMillimeters < 0
  )
    simpleError(
      "actualFocalMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.sensorDiagonalMillimeters) ||
    x.sensorDiagonalMillimeters < 0
  )
    simpleError(
      "sensorDiagonalMillimeters",
      "Provide a finite number at least 0.",
    );
  const equivalentFocalMillimeters =
    (x.actualFocalMillimeters * Math.hypot(36, 24)) /
    x.sensorDiagonalMillimeters;
  if (!Number.isFinite(equivalentFocalMillimeters))
    simpleError(
      "equivalentFocalMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    equivalentFocalMillimeters: Object.is(equivalentFocalMillimeters, -0)
      ? 0
      : equivalentFocalMillimeters,
  };
};

export const example = {
  input: { actualFocalMillimeters: 50, sensorDiagonalMillimeters: 28.85 },
  output: { equivalentFocalMillimeters: 74.98546846718868 },
} satisfies ToolExample<
  ThirtyFiveMmEquivalentFocalLengthInput,
  ThirtyFiveMmEquivalentFocalLengthOutput
>;

export const tool = createSimpleTool({
  id: "film/35mm-equivalent-focal-length",
  title: "35mm Equivalent Focal Length",
  description:
    "35 mm full-frame-equivalent focal length using the 36×24 mm diagonal divided by the camera sensor diagonal.",
  inputs: [
    {
      id: "actualFocalMillimeters",
      kind: "number",
      label: "Actual Focal Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "sensorDiagonalMillimeters",
      kind: "number",
      label: "Sensor Diagonal Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "equivalentFocalMillimeters",
      kind: "number",
      label: "Equivalent Focal Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateThirtyFiveMmEquivalentFocalLength({
      actualFocalMillimeters: input.actualFocalMillimeters as number,
      sensorDiagonalMillimeters: input.sensorDiagonalMillimeters as number,
    }),
});
export const thirtyFiveMmEquivalentFocalLengthTool = tool;
export const runThirtyFiveMmEquivalentFocalLength = tool.execute;
export default tool;
