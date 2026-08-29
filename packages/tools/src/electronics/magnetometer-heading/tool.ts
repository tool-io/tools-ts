import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MagnetometerHeadingInput = Readonly<{
  readonly xMicrotesla: number;
  readonly yMicrotesla: number;
}>;
export type MagnetometerHeadingOutput = Readonly<{ headingDegrees: number }>;

export const calculateMagnetometerHeading = (
  i: MagnetometerHeadingInput,
): MagnetometerHeadingOutput => {
  if (i.xMicrotesla === 0 && i.yMicrotesla === 0)
    simpleError(
      "xMicrotesla",
      "Heading is undefined for a zero horizontal magnetic vector.",
    );
  const value =
    ((Math.atan2(i.yMicrotesla, i.xMicrotesla) * 180) / Math.PI + 360) % 360;
  if (!Number.isFinite(value))
    simpleError("headingDegrees", "The inputs produce a non-finite result.");
  return { headingDegrees: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { xMicrotesla: 0, yMicrotesla: 25 },
  output: { headingDegrees: 90 },
} satisfies ToolExample<MagnetometerHeadingInput, MagnetometerHeadingOutput>;

export const tool = createSimpleTool({
  id: "electronics/magnetometer-heading",
  title: "Magnetometer Heading",
  description:
    "Calculate horizontal magnetic heading from leveled, calibrated magnetometer X/Y readings with atan2(Y,X), normalized to 0–360 degrees; declination is excluded.",
  inputs: [
    { id: "xMicrotesla", kind: "number", label: "X Microtesla" },
    { id: "yMicrotesla", kind: "number", label: "Y Microtesla" },
  ],
  outputs: [
    { id: "headingDegrees", kind: "number", label: "Heading (°)", unit: "°" },
  ],
  calculate: (input) =>
    calculateMagnetometerHeading({
      xMicrotesla: input.xMicrotesla as number,
      yMicrotesla: input.yMicrotesla as number,
    }),
});
export const magnetometerHeadingTool = tool;
export const runMagnetometerHeading = tool.execute;
export default tool;
