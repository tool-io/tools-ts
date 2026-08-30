import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GroundSampleDistanceGsdInput = Readonly<{
  readonly heightAboveGroundMeters: number;
  readonly pixelPitchMicrometers: number;
  readonly focalLengthMillimeters: number;
}>;
export type GroundSampleDistanceGsdOutput = Readonly<{
  readonly centimetersPerPixel: number;
}>;

export const calculateGroundSampleDistanceGsd = (
  x: GroundSampleDistanceGsdInput,
): GroundSampleDistanceGsdOutput => {
  if (
    !Number.isFinite(x.heightAboveGroundMeters) ||
    x.heightAboveGroundMeters <= 0
  )
    simpleError("heightAboveGroundMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.pixelPitchMicrometers) || x.pixelPitchMicrometers <= 0)
    simpleError("pixelPitchMicrometers", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.focalLengthMillimeters) ||
    x.focalLengthMillimeters <= 0
  )
    simpleError("focalLengthMillimeters", "Provide a finite positive number.");
  const centimetersPerPixel =
    (x.heightAboveGroundMeters * x.pixelPitchMicrometers) /
    (10 * x.focalLengthMillimeters);
  if (!Number.isFinite(centimetersPerPixel))
    simpleError(
      "centimetersPerPixel",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    centimetersPerPixel: Object.is(centimetersPerPixel, -0)
      ? 0
      : centimetersPerPixel,
  };
};

export const example = {
  input: {
    heightAboveGroundMeters: 1000,
    pixelPitchMicrometers: 5,
    focalLengthMillimeters: 100,
  },
  output: { centimetersPerPixel: 5 },
} satisfies ToolExample<
  GroundSampleDistanceGsdInput,
  GroundSampleDistanceGsdOutput
>;

export const tool = createSimpleTool({
  id: "cartography/ground-sample-distance-gsd",
  title: "Ground Sample Distance Gsd",
  description:
    "Ground sample distance in centimetres per pixel for a nadir image, using altitude, sensor pixel pitch, and focal length.",
  inputs: [
    {
      id: "heightAboveGroundMeters",
      kind: "number",
      label: "Height Above Ground Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "pixelPitchMicrometers",
      kind: "number",
      label: "Pixel Pitch Micrometers",
      unit: "um",
      minimum: 0,
    },
    {
      id: "focalLengthMillimeters",
      kind: "number",
      label: "Focal Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "centimetersPerPixel",
      kind: "number",
      label: "Centimeters Per Pixel",
      unit: "cm/px",
    },
  ],
  calculate: (input) =>
    calculateGroundSampleDistanceGsd({
      heightAboveGroundMeters: input.heightAboveGroundMeters as number,
      pixelPitchMicrometers: input.pixelPitchMicrometers as number,
      focalLengthMillimeters: input.focalLengthMillimeters as number,
    }),
});
export const groundSampleDistanceGsdTool = tool;
export const runGroundSampleDistanceGsd = tool.execute;
export default tool;
