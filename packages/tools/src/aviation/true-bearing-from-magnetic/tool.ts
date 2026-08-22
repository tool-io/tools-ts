import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type TrueBearingFromMagneticInput = {
  readonly magneticBearingDeg: number;
  readonly variationDeg: number;
};

export type TrueBearingFromMagneticOutput = {
  readonly trueBearingDeg: number;
};

const normalizeDegrees = (value: number): number => ((value % 360) + 360) % 360;

export const trueBearingFromMagneticExample = {
  input: { magneticBearingDeg: 350, variationDeg: 20 },
  output: { trueBearingDeg: 10 },
} satisfies ToolExample<
  TrueBearingFromMagneticInput,
  TrueBearingFromMagneticOutput
>;

export const calculateTrueBearingFromMagnetic = (
  input: TrueBearingFromMagneticInput,
): TrueBearingFromMagneticOutput => ({
  trueBearingDeg: normalizeDegrees(
    input.magneticBearingDeg + input.variationDeg,
  ),
});

export const trueBearingFromMagneticTool = createSimpleTool({
  calculate: (input) =>
    calculateTrueBearingFromMagnetic(
      input as unknown as TrueBearingFromMagneticInput,
    ),
  description:
    "Convert a magnetic bearing to a true bearing by adding east-positive variation.",
  id: "aviation/true-bearing-from-magnetic",
  inputs: [
    {
      description: "Bearing measured from magnetic north.",
      id: "magneticBearingDeg",
      kind: "number",
      label: "Magnetic bearing",
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
      description: "True bearing normalized to zero through 360.",
      format: "angle",
      id: "trueBearingDeg",
      kind: "number",
      label: "True bearing",
      unit: "°",
    },
  ],
  title: "True Bearing from Magnetic Calculator",
});
export const runTrueBearingFromMagnetic = trueBearingFromMagneticTool.execute;
export default trueBearingFromMagneticTool;
