import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MagneticHeadingInput = {
  readonly trueHeadingDeg: number;
  readonly variationDeg: number;
};

export type MagneticHeadingOutput = {
  readonly magneticHeadingDeg: number;
};

const normalizeDegrees = (value: number): number => ((value % 360) + 360) % 360;

export const magneticHeadingExample = {
  input: { trueHeadingDeg: 350, variationDeg: 15 },
  output: { magneticHeadingDeg: 335 },
} satisfies ToolExample<MagneticHeadingInput, MagneticHeadingOutput>;

export const calculateMagneticHeading = (
  input: MagneticHeadingInput,
): MagneticHeadingOutput => ({
  magneticHeadingDeg: normalizeDegrees(
    input.trueHeadingDeg - input.variationDeg,
  ),
});

export const magneticHeadingTool = createSimpleTool({
  calculate: (input) =>
    calculateMagneticHeading(input as unknown as MagneticHeadingInput),
  description:
    "Convert a true heading to a magnetic heading using east-positive variation (east is least).",
  id: "aviation/magnetic-heading",
  inputs: [
    {
      description: "True heading.",
      id: "trueHeadingDeg",
      kind: "number",
      label: "True heading",
      unit: "°",
    },
    {
      description:
        "Magnetic variation at the position; east positive, west negative.",
      id: "variationDeg",
      kind: "number",
      label: "Variation",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Magnetic heading normalized to zero through 360.",
      format: "angle",
      id: "magneticHeadingDeg",
      kind: "number",
      label: "Magnetic heading",
      unit: "°",
    },
  ],
  title: "Magnetic Heading Calculator",
});
export const runMagneticHeading = magneticHeadingTool.execute;
export default magneticHeadingTool;
