import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhotoScaleAltitudeFocalInput = Readonly<{
  readonly heightAboveGroundMeters: number;
  readonly focalLengthMillimeters: number;
}>;
export type PhotoScaleAltitudeFocalOutput = Readonly<{
  readonly denominator: number;
}>;

export const calculatePhotoScaleAltitudeFocal = (
  x: PhotoScaleAltitudeFocalInput,
): PhotoScaleAltitudeFocalOutput => {
  if (
    !Number.isFinite(x.heightAboveGroundMeters) ||
    x.heightAboveGroundMeters <= 0
  )
    simpleError("heightAboveGroundMeters", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.focalLengthMillimeters) ||
    x.focalLengthMillimeters <= 0
  )
    simpleError("focalLengthMillimeters", "Provide a finite positive number.");
  const denominator =
    (1000 * x.heightAboveGroundMeters) / x.focalLengthMillimeters;
  if (!Number.isFinite(denominator))
    simpleError(
      "denominator",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { denominator: Object.is(denominator, -0) ? 0 : denominator };
};

export const example = {
  input: {
    heightAboveGroundMeters: 1000,
    focalLengthMillimeters: 100,
  },
  output: { denominator: 10000 },
} satisfies ToolExample<
  PhotoScaleAltitudeFocalInput,
  PhotoScaleAltitudeFocalOutput
>;

export const tool = createSimpleTool({
  id: "cartography/photo-scale-altitude-focal",
  title: "Photo Scale Altitude Focal",
  description:
    "Approximate vertical aerial-photo scale denominator H/f when altitude above ground and focal length use the same units.",
  inputs: [
    {
      id: "heightAboveGroundMeters",
      kind: "number",
      label: "Height Above Ground Meters",
      unit: "m",
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
  outputs: [{ id: "denominator", kind: "number", label: "Denominator" }],
  calculate: (input) =>
    calculatePhotoScaleAltitudeFocal({
      heightAboveGroundMeters: input.heightAboveGroundMeters as number,
      focalLengthMillimeters: input.focalLengthMillimeters as number,
    }),
});
export const photoScaleAltitudeFocalTool = tool;
export const runPhotoScaleAltitudeFocal = tool.execute;
export default tool;
