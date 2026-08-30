import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MagneticDeclinationApplierInput = Readonly<{
  readonly magneticAzimuthDegrees: number;
  readonly declinationDegrees: number;
}>;
export type MagneticDeclinationApplierOutput = Readonly<{
  readonly trueAzimuthDegrees: number;
}>;

export const calculateMagneticDeclinationApplier = (
  x: MagneticDeclinationApplierInput,
): MagneticDeclinationApplierOutput => {
  if (
    !Number.isFinite(x.magneticAzimuthDegrees) ||
    x.magneticAzimuthDegrees < 0
  )
    simpleError(
      "magneticAzimuthDegrees",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.declinationDegrees))
    simpleError("declinationDegrees", "Provide a finite number.");
  if (!(
    x.magneticAzimuthDegrees < 360 && Math.abs(x.declinationDegrees) <= 180
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const trueAzimuthDegrees =
    (((x.magneticAzimuthDegrees + x.declinationDegrees) % 360) + 360) % 360;
  if (!Number.isFinite(trueAzimuthDegrees))
    simpleError(
      "trueAzimuthDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    trueAzimuthDegrees: Object.is(trueAzimuthDegrees, -0)
      ? 0
      : trueAzimuthDegrees,
  };
};

export const example = {
  input: {
    magneticAzimuthDegrees: 350,
    declinationDegrees: 15,
  },
  output: { trueAzimuthDegrees: 5 },
} satisfies ToolExample<
  MagneticDeclinationApplierInput,
  MagneticDeclinationApplierOutput
>;

export const tool = createSimpleTool({
  id: "cartography/magnetic-declination-applier",
  title: "Magnetic Declination Applier",
  description:
    "True azimuth from magnetic azimuth plus signed east-positive magnetic declination.",
  inputs: [
    {
      id: "magneticAzimuthDegrees",
      kind: "number",
      label: "Magnetic Azimuth Degrees",
      unit: "deg",
      minimum: 0,
    },
    {
      id: "declinationDegrees",
      kind: "number",
      label: "Declination Degrees",
      unit: "deg",
    },
  ],
  outputs: [
    {
      id: "trueAzimuthDegrees",
      kind: "number",
      label: "True Azimuth Degrees",
      unit: "deg",
    },
  ],
  calculate: (input) =>
    calculateMagneticDeclinationApplier({
      magneticAzimuthDegrees: input.magneticAzimuthDegrees as number,
      declinationDegrees: input.declinationDegrees as number,
    }),
});
export const magneticDeclinationApplierTool = tool;
export const runMagneticDeclinationApplier = tool.execute;
export default tool;
