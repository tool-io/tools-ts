import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MagneticToGridConverterInput = Readonly<{
  readonly magneticAzimuthDegrees: number;
  readonly convergenceDegrees: number;
  readonly declinationDegrees: number;
}>;
export type MagneticToGridConverterOutput = Readonly<{
  readonly gridAzimuthDegrees: number;
}>;

export const calculateMagneticToGridConverter = (
  x: MagneticToGridConverterInput,
): MagneticToGridConverterOutput => {
  if (
    !Number.isFinite(x.magneticAzimuthDegrees) ||
    x.magneticAzimuthDegrees < 0
  )
    simpleError(
      "magneticAzimuthDegrees",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.convergenceDegrees))
    simpleError("convergenceDegrees", "Provide a finite number.");
  if (!Number.isFinite(x.declinationDegrees))
    simpleError("declinationDegrees", "Provide a finite number.");
  if (!(x.magneticAzimuthDegrees < 360))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const gridAzimuthDegrees =
    (((x.magneticAzimuthDegrees + x.declinationDegrees - x.convergenceDegrees) %
      360) +
      360) %
    360;
  if (!Number.isFinite(gridAzimuthDegrees))
    simpleError(
      "gridAzimuthDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    gridAzimuthDegrees: Object.is(gridAzimuthDegrees, -0)
      ? 0
      : gridAzimuthDegrees,
  };
};

export const example = {
  input: {
    magneticAzimuthDegrees: 30,
    convergenceDegrees: 2,
    declinationDegrees: 5,
  },
  output: { gridAzimuthDegrees: 33 },
} satisfies ToolExample<
  MagneticToGridConverterInput,
  MagneticToGridConverterOutput
>;

export const tool = createSimpleTool({
  id: "cartography/magnetic-to-grid-converter",
  title: "Magnetic To Grid Converter",
  description:
    "Grid azimuth from magnetic azimuth, signed grid convergence (true minus grid), and east-positive declination.",
  inputs: [
    {
      id: "magneticAzimuthDegrees",
      kind: "number",
      label: "Magnetic Azimuth Degrees",
      unit: "deg",
      minimum: 0,
    },
    {
      id: "convergenceDegrees",
      kind: "number",
      label: "Convergence Degrees",
      unit: "deg",
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
      id: "gridAzimuthDegrees",
      kind: "number",
      label: "Grid Azimuth Degrees",
      unit: "deg",
    },
  ],
  calculate: (input) =>
    calculateMagneticToGridConverter({
      magneticAzimuthDegrees: input.magneticAzimuthDegrees as number,
      convergenceDegrees: input.convergenceDegrees as number,
      declinationDegrees: input.declinationDegrees as number,
    }),
});
export const magneticToGridConverterTool = tool;
export const runMagneticToGridConverter = tool.execute;
export default tool;
