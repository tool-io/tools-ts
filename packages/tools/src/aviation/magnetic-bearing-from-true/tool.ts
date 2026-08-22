import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MagneticBearingFromTrueInput = {
  readonly trueBearingDeg: number;
  readonly variationDeg: number;
};

export type MagneticBearingFromTrueOutput = {
  readonly magneticBearingDeg: number;
};

const normalizeDegrees = (value: number): number => ((value % 360) + 360) % 360;

export const magneticBearingFromTrueExample = {
  input: { trueBearingDeg: 10, variationDeg: 20 },
  output: { magneticBearingDeg: 350 },
} satisfies ToolExample<
  MagneticBearingFromTrueInput,
  MagneticBearingFromTrueOutput
>;

export const calculateMagneticBearingFromTrue = (
  input: MagneticBearingFromTrueInput,
): MagneticBearingFromTrueOutput => ({
  magneticBearingDeg: normalizeDegrees(
    input.trueBearingDeg - input.variationDeg,
  ),
});

export const magneticBearingFromTrueTool = createSimpleTool({
  calculate: (input) =>
    calculateMagneticBearingFromTrue(
      input as unknown as MagneticBearingFromTrueInput,
    ),
  description:
    "Convert a true bearing to a magnetic bearing by subtracting east-positive variation.",
  id: "aviation/magnetic-bearing-from-true",
  inputs: [
    {
      description: "Bearing measured from true north.",
      id: "trueBearingDeg",
      kind: "number",
      label: "True bearing",
      maximum: 360,
      minimum: 0,
      unit: "°",
    },
    {
      description:
        "Magnetic variation at the position; east positive, west negative.",
      id: "variationDeg",
      kind: "number",
      label: "Variation",
      maximum: 180,
      minimum: -180,
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Magnetic bearing normalized to zero through 360.",
      format: "angle",
      id: "magneticBearingDeg",
      kind: "number",
      label: "Magnetic bearing",
      unit: "°",
    },
  ],
  title: "Magnetic Bearing from True Calculator",
});
export const runMagneticBearingFromTrue = magneticBearingFromTrueTool.execute;
export default magneticBearingFromTrueTool;
